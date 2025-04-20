import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Perfume } from '../models/perfume.model';

export interface CartItem {
  perfume: Perfume;
  quantity: number;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.loadCart();
  }

  private loadCart() {
    this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection<CartItem>(`users/${user.uid}/cart`).valueChanges({ idField: 'id' });
        } else {
          // Handle guest cart (you might want to use localStorage for guests)
          return of([]);
        }
      })
    ).subscribe(cartItems => {
      this.cartSubject.next(cartItems);
    });
  }

  getItems(): Observable<CartItem[]> {
    return this.cart$;
  }

  async addItem(item: Perfume, size: string = 'standard'): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      // User is logged in - use Firestore
      const cartRef = this.firestore.collection(`users/${user.uid}/cart`);
      const query = cartRef.ref.where('perfume.id', '==', item.id).where('size', '==', size);
      const snapshot = await query.get();

      if (!snapshot.empty) {
        // Item exists - update quantity
        const doc = snapshot.docs[0];
        const currentQuantity = (doc.data() as { quantity: number }).quantity;
        await doc.ref.update({ quantity: currentQuantity + 1 });
      } else {
        // Item doesn't exist - add new
        await cartRef.add({
          perfume: item,
          quantity: 1,
          size
        });
      }
    } else {
      // Guest user - use local storage (or BehaviorSubject)
      const currentCart = this.cartSubject.value;
      const existingItem = currentCart.find(
        i => i.perfume.id === item.id && i.size === size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentCart.push({
          perfume: item,
          quantity: 1,
          size
        });
      }
      this.cartSubject.next(currentCart);
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
    }
  }

  async updateQuantity(itemId: any, quantity: any, size: any = 'standard'): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      const cartRef = this.firestore.collection(`users/${user.uid}/cart`);
      const query = cartRef.ref.where('perfume.id', '==', itemId).where('size', '==', size);
      const snapshot = await query.get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({ quantity });
      }
    } else {
      const currentCart = this.cartSubject.value;
      const item = currentCart.find((i: any) => i.perfume.id === itemId && i.size === size);
      if (item) {
        item.quantity = quantity;
        this.cartSubject.next(currentCart);
        localStorage.setItem('guestCart', JSON.stringify(currentCart));
      }
    }
  }

  async removeItem(itemId: any, size: any = 'standard'): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      const cartRef = this.firestore.collection(`users/${user.uid}/cart`);
      const query = cartRef.ref.where('perfume.id', '==', itemId).where('size', '==', size);
      const snapshot = await query.get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.delete();
      }
    } else {
      const currentCart = this.cartSubject.value.filter(
        (item: any) => !(item.perfume.id === itemId && item.size === size)
      );
      this.cartSubject.next(currentCart);
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
    }
  }

  async clearCart(): Promise<void> {
    const user = await this.auth.currentUser;

    if (user) {
      const cartRef = this.firestore.collection(`users/${user.uid}/cart`);
      const snapshot = await cartRef.ref.get();

      const batch = this.firestore.firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } else {
      this.cartSubject.next([]);
      localStorage.removeItem('guestCart');
    }
  }

  getTotalItems(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }
}
