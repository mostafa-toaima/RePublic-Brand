import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'custom-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  router = inject(Router);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getCartItemCount();
    this.getWishlistItemCount();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCartItemCount() {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItemCount = this.cartService.getCartItemCount();
      });
  }

  getWishlistItemCount() {
    this.wishlistService.wishlistCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.wishlistItemCount = count;
      });
  }

  collapseNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      new (window as any).bootstrap.Collapse(navbar).hide();
    }
  }

  openCart() {
    this.router.navigate(['/cart']);
  }

  exploreCollectionFor(type: string) {
    this.router.navigate(['/products'], { queryParams: { type } });
  }

  openWishList() {
    this.router.navigate(['/wishlist']);
  }
}
