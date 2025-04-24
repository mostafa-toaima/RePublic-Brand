import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Perfume } from '../models/perfume.model';

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'fragrance_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCart());
  cart$ = this.cartSubject.asObservable();

  constructor() { }

  private getCart(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(perfume: Perfume): void {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.perfume.id === perfume.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ perfume, quantity: 1 });
    }

    this.saveCart(cart);
  }

  removeFromCart(perfumeId: string): void {
    const cart = this.getCart().filter(item => item.perfume.id !== perfumeId);
    this.saveCart(cart);
  }

  updateQuantity(perfumeId: string, quantity: number): void {
    if (quantity < 1) return;

    const cart = this.getCart();
    const item = cart.find(i => i.perfume.id === perfumeId);

    if (item) {
      item.quantity = quantity;
      this.saveCart(cart);
    }
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartSubject.next([]);
  }

  getCartItemCount(): number {
    return this.getCart().reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.getCart().reduce(
      (total, item) => total + (item.perfume.price * item.quantity),
      0
    );
  }

  isInCart(perfumeId: string): boolean {
    return this.getCart().some(item => item.perfume.id === perfumeId);
  }
}
