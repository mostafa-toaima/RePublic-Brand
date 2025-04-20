import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldValue, serverTimestamp } from 'firebase/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models and Services
import { Perfume } from '../../../../common/models/perfume.model';
import { PerfumeService } from '../../../../common/services/perfume.service';
import { ProductsService } from '../../services/products.service';
import { environment } from '../../../../../environment';
import { CartItem } from '../../../../common/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  paymentMethod: string = 'cash';
  orderSubmitted = false;
  isLoading = false;
  orderId: string = '';

  // Error states
  formError: string | null = null;
  emailError: string | null = null;

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private productService = inject(ProductsService);
  private http = inject(HttpClient);
  private firestore = inject(AngularFirestore);

  constructor(
    private perfumeService: PerfumeService,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)]],
      notes: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.setupRouterScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartItems(): void {
    this.perfumeService.getAllPerfumes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.cartItems = items
            .filter(item => item.inCart)
            .map(item => ({
              perfume: item,
              quantity: item?.quantity || 1
            }));
        },
        error: (err) => {
          console.error('Failed to load cart items:', err);
          this.formError = 'Failed to load your cart items. Please try again.';
        }
      });
  }

  private setupRouterScroll(): void {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash) {
          setTimeout(() => {
            document.querySelector(window.location.hash)?.scrollIntoView({
              behavior: 'smooth'
            });
          }, 0);
        }
      });
  }

  trackByPerfumeId(index: number, item: CartItem): string {
    return item.perfume.id || '';
  }

  get totalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.perfume.price * item.quantity),
      0
    );
  }

  get taxAmount(): number {
    return this.totalPrice * 0.08; // 8% tax
  }

  get grandTotal(): number {
    return this.totalPrice + this.taxAmount;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1 || quantity > 99) return;

    const updatedItem = { ...item, quantity };
    // this.productService.updateCartQuantity(
    //   updatedItem.perfume,
    //   updatedItem.quantity
    // ).catch((err: any) => {
    //   console.error('Failed to update quantity:', err);
    //   this.formError = 'Failed to update quantity. Please try again.';
    // });
  }

  async removeFromCart(perfume: Perfume): Promise<void> {
    try {
      await this.productService.updateCart(perfume, false, 'inCart');
    } catch (err) {
      console.error('Failed to remove item:', err);
      this.formError = 'Failed to remove item. Please try again.';
    }
  }

  async onSubmit(): Promise<void> {
    // Reset errors
    this.formError = null;
    this.emailError = null;

    // Validate form
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.formError = 'Please fill out all required fields correctly.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    try {
      // Generate order ID
      this.orderId = this.generateOrderId();

      // Prepare order data
      const orderData = {
        id: this.orderId,
        ...this.checkoutForm.value,
        items: this.cartItems.map(item => ({
          id: item.perfume.id,
          name: item.perfume.name,
          price: item.perfume.price,
          quantity: item.quantity,
          image: item.perfume.images[0],
          size: item.perfume.price || '100ml'
        })),
        subtotal: this.totalPrice,
        tax: this.taxAmount,
        total: this.grandTotal,
        paymentMethod: this.paymentMethod,
        status: 'processing',
        timestamp: serverTimestamp() as FieldValue
        // timestamp: this.firestore.firestore.FieldValue.serverTimestamp()
      };

      // Save to Firestore
      await this.firestore.collection('orders').doc(this.orderId).set(orderData);

      // Send email notifications
      await this.sendOrderNotifications(orderData);

      // Clear the cart
      await this.clearCart();

      // Mark order as submitted
      this.orderSubmitted = true;
    } catch (error) {
      console.error('Order submission failed:', error);
      this.formError = 'Failed to submit your order. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${randomStr}`.toUpperCase();
  }

  private async sendOrderNotifications(orderData: any): Promise<void> {
    try {
      // Send to admin
      await this.sendEmailNotification({
        to: 'moustafaebrahin124@gmail.com',
        subject: `New Order Received - ${orderData.id}`,
        text: `You have received a new order from ${orderData.firstName} ${orderData.lastName}`,
        html: this.generateAdminEmailHtml(orderData)
      });

      // Send to customer
      await this.sendEmailNotification({
        to: orderData.email,
        subject: `Your Order Confirmation - ${orderData.id}`,
        text: `Thank you for your order ${orderData.firstName}!`,
        html: this.generateCustomerEmailHtml(orderData)
      });
    } catch (error) {
      console.error('Email notification failed:', error);
      this.emailError = 'Order was placed but email notification failed. Please check your email for confirmation.';
    }
  }

  private async sendEmailNotification(emailData: any): Promise<void> {
    if (!environment.production) {
      console.log('Email would be sent in production:', emailData);
      return;
    }

    // await this.http.post(`${environment.apiUrl}/send-email`, emailData).toPromise();
  }

  private async clearCart(): Promise<void> {
    const updatePromises = this.cartItems.map(item =>
      this.productService.updateCart(item.perfume, false, 'inCart')
    );
    await Promise.all(updatePromises);
  }

  private generateAdminEmailHtml(orderData: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">New Order Notification</h2>
        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Customer:</strong> ${orderData.firstName} ${orderData.lastName}</p>
        <p><strong>Email:</strong> ${orderData.email}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Date:</strong> ${new Date(orderData.date).toLocaleString()}</p>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map((item: any) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; vertical-align: top;">
                  <div style="font-weight: 500;">${item.name}</div>
                  <div style="font-size: 0.9em; color: #666;">${item.size}</div>
                </td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${this.formatCurrency(item.price)}
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${item.quantity}
                </td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${this.formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Subtotal</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #ddd;">${this.formatCurrency(orderData.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Tax</td>
              <td style="padding: 12px; text-align: right;">${this.formatCurrency(orderData.tax)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">${this.formatCurrency(orderData.total)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Shipping Information</h3>
        <p>${orderData.address}</p>
        <p>${orderData.city}, ${orderData.zipCode}</p>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Payment Method</h3>
        <p>${orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}</p>

        ${orderData.notes ? `
          <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Customer Notes</h3>
          <p>${orderData.notes}</p>
        ` : ''}

        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
          This is an automated notification. Please contact the customer if you need any additional information.
        </p>
      </div>
    `;
  }

  private generateCustomerEmailHtml(orderData: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2c3e50;">Thank You For Your Order!</h2>
        <p>Hi ${orderData.firstName},</p>
        <p>We've received your order and it's now being processed. Here are your order details:</p>

        <p><strong>Order ID:</strong> ${orderData.id}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleString()}</p>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Your Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map((item: any) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; vertical-align: top;">
                  <div style="font-weight: 500;">${item.name}</div>
                  <div style="font-size: 0.9em; color: #666;">${item.size}</div>
                </td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${this.formatCurrency(item.price)}
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${item.quantity}
                </td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; vertical-align: top;">
                  ${this.formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Subtotal</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #ddd;">${this.formatCurrency(orderData.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Tax</td>
              <td style="padding: 12px; text-align: right;">${this.formatCurrency(orderData.tax)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">${this.formatCurrency(orderData.total)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Shipping Information</h3>
        <p>${orderData.address}</p>
        <p>${orderData.city}, ${orderData.zipCode}</p>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">Payment Method</h3>
        <p>${orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}</p>

        <h3 style="margin-top: 25px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 8px;">What's Next?</h3>
        <p>Our team is preparing your order. You'll receive another email when your order ships.</p>
        <p>If you have any questions about your order, please reply to this email.</p>

        <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
          Thank you for shopping with us!
        </p>
      </div>
    `;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
