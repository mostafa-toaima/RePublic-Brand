import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-perfume-details',
  templateUrl: './perfume-details.component.html',
  styleUrls: ['./perfume-details.component.scss']
})
export class PerfumeDetailsComponent {
  @Input() perfume: any;
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @Output() addedToCart = new EventEmitter<any>();

  selectedImage: string = '';
  selectedSize: string = '';

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

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToCart() {
    this.addedToCart.emit({
      ...this.perfume,
      selectedSize: this.selectedSize
    });
  }
}
