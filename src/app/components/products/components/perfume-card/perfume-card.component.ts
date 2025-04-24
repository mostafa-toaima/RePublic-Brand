import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfume } from '../../../../common/models/perfume.model';
import { Router } from '@angular/router';
import { CartService } from '../../../../common/services/cart.service';
import { PerfumeService } from '../../../../common/services/perfume.service';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../../../common/services/wishlist.service';

@Component({
  selector: 'perfume-card',
  templateUrl: './perfume-card.component.html',
  styleUrls: ['./perfume-card.component.scss']
})
export class PerfumeCardComponent implements OnInit {
  @Input() perfume: Perfume | undefined;
  showDetails: boolean = false;
  showNotes: boolean = false;
  addedToCart: boolean = false;
  isInWishlist: boolean = false;
  selectedSize: string = '50';
  availableSizes: string[] = ['30', '50', '100'];

  router = inject(Router);
  cartService = inject(CartService);
  perfumeService = inject(PerfumeService);
  productSerivce = inject(ProductsService);
  wishListService = inject(WishlistService);

  ngOnInit(): void {
    if (this.perfume?.id) {
      this.addedToCart = this.cartService.isInCart(this.perfume.id);
      this.isInWishlist = this.wishListService.isInWishList(this.perfume.id);
    }
  }
  toggleNotes() {
    this.showNotes = !this.showNotes;
  }

  addToCart(perfume: Perfume): void {
    this.cartService.addToCart(perfume);
    this.addedToCart = true;
  }

  removeFromCart(perfume: Perfume): void {
    if (perfume.id) {
      this.cartService.removeFromCart(perfume.id);
    }
    this.addedToCart = false;
  }

  toggleWishlist(perfume: Perfume) {
    if (!perfume.id) {
      return;
    }
    this.isInWishlist = !this.isInWishlist;
    if (this.isInWishlist) {
      this.wishListService.addToWishList(perfume);
    } else {
      this.wishListService.removeFromWishList(perfume.id);
    }
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
  getFeatureIcon(feature: string): string {
    const icons: { [key: string]: string } = {
      'Lemon': 'icon-droplet',
      'top': 'icon-clock',
      'Unisex': 'icon-genderless',
      'Organic': 'icon-leaf',
      'Vegan': 'icon-seedling',
      'Limited Edition': 'icon-star'
    };
    return icons[feature] || 'icon-circle';
  }

  openDetails(perfume: Perfume) {
    this.showDetails = !this.showDetails
  }


}

