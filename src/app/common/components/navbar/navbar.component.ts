import { WishlistService } from './../../services/wishlist.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume } from '../../models/perfume.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'custom-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // fix: should be style**Urls**
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  router = inject(Router);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  ngOnInit() {
    this.getCartItemCount();
    this.getWishlistItemCount();
  }

  getCartItemCount() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
  getWishlistItemCount() {
    this.wishlistService.wishlistCount$.subscribe(count => {
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

  }
}
