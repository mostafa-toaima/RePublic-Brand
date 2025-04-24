import { Injectable } from '@angular/core';
import { Perfume } from '../models/perfume.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistKey = 'wishlist';
  private wishlistSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistSubject.asObservable();


  constructor() {
    this.updateWishlistCount();
  }


  private updateWishlistCount() {
    const count = this.getWishList().length;
    this.wishlistSubject.next(count);
  }

  getWishList(): any[] {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  addToWishList(perfume: Perfume): void {
    const wishlist = this.getWishList();
    wishlist.push({ perfumeId: perfume.id, perfume });
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    this.updateWishlistCount();
  }

  removeFromWishList(perfumeId: string): void {
    const wishlist = this.getWishList().filter(item => item.perfumeId !== perfumeId);
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    this.updateWishlistCount();
  }

  isInWishList(perfumeId: string): boolean {
    return this.getWishList().some(item => item.perfumeId === perfumeId);
  }

  clearWishList(): void {
    localStorage.removeItem(this.wishlistKey);
    this.updateWishlistCount();
  }
}
