import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../../common/services/cart.service';
import { OrderService } from '../../../../common/services/order.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  checkoutForm: FormGroup;
  paymentMethod: string = 'cash';
  orderSubmitted = false;
  isLoading = false;
  orderId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      // zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((items: any) => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }


  updateQuantity(item: any, newQuantity: number): void {
    this.cartService.updateQuantity(item.perfume.id, newQuantity);
  }

  removeItem(perfume: any): void {
    if (perfume.id) {
      this.cartService.removeFromCart(perfume.id);
    }
  }

  // In your cart.component.ts
  // Add this debug line before sending emails
  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid || this.isLoading) return;

    this.isLoading = true;

    try {
      const orderData = {
        ...this.checkoutForm.value,
        items: this.cartItems,
        subtotal: this.totalPrice,
        tax: 0,
        total: this.totalPrice,
        paymentMethod: this.paymentMethod,
        status: 'pending'
      };

      console.log('Order data before sending:', orderData); // Debug line

      const order = await this.orderService.createOrder(orderData);
      this.orderId = order.id;
      this.orderSubmitted = true;
      this.cartService.clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      this.isLoading = false;
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  trackByPerfumeId(index: number, item: any): string {
    return item.perfume.id;
  }
}
