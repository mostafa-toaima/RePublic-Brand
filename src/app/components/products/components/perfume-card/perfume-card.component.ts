import { Component, inject, Input, OnInit } from '@angular/core';
import { Perfume } from '../../../../common/models/perfume.model';
import { Router } from '@angular/router';
import { CartService } from '../../../../common/services/cart.service';
import { PerfumeService } from '../../../../common/services/perfume.service';
import { ProductsService } from '../../services/products.service';

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
  selectedSize: string = '50';
  availableSizes: string[] = ['30', '50', '100'];

  router = inject(Router);
  cartService = inject(CartService);
  perfumeService = inject(PerfumeService);
  productSerivce = inject(ProductsService);

  ngOnInit(): void {
    this.addedToCart = this.perfume?.inCart || false;
  }
  toggleNotes() {
    this.showNotes = !this.showNotes;
  }



  removeFromCart(perfume: Perfume): void {
    this.productSerivce.updateCart(perfume, false, 'inCart');
  }
  addToCart(perfume: Perfume): void {
    this.productSerivce.updateCart(perfume, true, 'inCart');
  }


  toggleWishlist(perfume: Perfume) {
    if (!perfume.id) {
      return;
    }
    perfume.inWishlist = !perfume.inWishlist;
    if (perfume.inWishlist) {
      this.productSerivce.addToWishlist(perfume);
    } else {
      this.productSerivce.removeFromWishlist(perfume);
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

