import { WishlistService } from './../../../../common/services/wishlist.service';
import { Perfume } from '../../../../common/models/perfume.model';
import { ProductsService } from './../../services/products.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-perfume-details',
  templateUrl: './perfume-details.component.html',
  styleUrls: ['./perfume-details.component.scss']
})
export class PerfumeDetailsComponent {
  @Input() perfume: any;
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<any>();
  @Output() removeFromoCart = new EventEmitter<any>();
  addedToCart: boolean = false
  selectedImage: string = '';
  selectedSize: string = '';
  productSerivce = inject(ProductsService);
  wishlistService = inject(WishlistService);
  ngOnInit() {
    if (this.perfume && this.perfume.images && this.perfume.images.length > 0) {
      this.selectedImage = this.perfume.images[0];
    }
    if (this.perfume && this.perfume.sizes && this.perfume.sizes.length > 0) {
      this.selectedSize = this.perfume.sizes[0];
    }
  }

  closeDetails() {
    this.closed.emit();
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  prevImage() {
    const currentIndex = this.perfume.images.indexOf(this.selectedImage);
    const prevIndex = (currentIndex - 1 + this.perfume.images.length) % this.perfume.images.length;
    this.selectedImage = this.perfume.images[prevIndex];
  }

  nextImage() {
    const currentIndex = this.perfume.images.indexOf(this.selectedImage);
    const nextIndex = (currentIndex + 1) % this.perfume.images.length;
    this.selectedImage = this.perfume.images[nextIndex];
  }

  togleCart() {
    this.addedToCart = !this.addedToCart;
    if (this.addedToCart) {
      this.addToCart.emit(this.perfume);
    } else {
      this.removeFromoCart.emit(this.perfume);
    }
  }
}
