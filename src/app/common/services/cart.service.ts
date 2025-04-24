import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Perfume } from '../models/perfume.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'guest_cart';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.updateCartCount();
  }

  private updateCartCount() {
    const count = this.getCart().length;
    this.cartCountSubject.next(count);
  }

  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  addToCart(perfume: Perfume, size: string): void {
    const cart = this.getCart();
    cart.push({ perfumeId: perfume.id, size });
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  removeFromCart(perfumeId: string): void {
    const cart = this.getCart().filter(item => item.perfumeId !== perfumeId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.updateCartCount();
  }

  getCartItemCount(): number {
    return this.getCart().length;
  }

  isInCart(perfumeId: string): boolean {
    return this.getCart().some(item => item.perfumeId === perfumeId);
  }
}
