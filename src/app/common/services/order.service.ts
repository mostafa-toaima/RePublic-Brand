import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import emailjs from 'emailjs-com';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private firestore: AngularFirestore) {
    emailjs.init(environment.emailjs.userId);
  }

  async createOrder(orderData: any): Promise<any> {
    const orderId = this.generateOrderId();
    const order = {
      id: orderId,
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    };

    await this.firestore.collection('orders').doc(orderId).set(order);
    await this.sendEmails(order);
    return order;
  }

  private async sendEmails(order: any): Promise<void> {
    try {
      if (!order.email || !this.validateEmail(order.email)) {
        throw new Error(`Invalid email address: ${order.email}`);
      }
      const customerEmailParams = {
        email: order.email,
        name: `${order.firstName} ${order.lastName}`,
        order_id: order.id,
        order_items: order.items.map((item: any) =>
          `${item.perfume.name} (Q: ${item.quantity}) = EGP ${item.perfume.price * item.quantity}`
        ).join('\n'),
        total: order.total
      };

      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateIdCustomer,
        customerEmailParams
      );

      const adminEmailParams = {
        to_email: 'farahatadel3@gmail.com',
        order_id: order.id,
        customer_name: `${order.firstName} ${order.lastName}`,
        customer_email: order.email,
        customer_phone: order.phone,
        delivery_address: `${order.address}, ${order.city}`,
        order_items: order.items.map((item: any) =>
          `${item.perfume.name} (Q: ${item.quantity}) = EGP ${item.perfume.price * item.quantity}`
        ).join('\n'),
        total: order.total,
        payment_method: order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'
      };

      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateIdAdmin,
        adminEmailParams
      );
    } catch (error) {
      throw error;
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
