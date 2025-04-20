import { Component, inject, Input } from '@angular/core';
import { Perfume } from '../../../common/models/perfume.model';
import { Router } from '@angular/router';

@Component({
  selector: 'perfume-card',
  templateUrl: './perfume-card.component.html',
  styleUrls: ['./perfume-card.component.scss']
})
export class PerfumeCardComponent {
  @Input() perfume: Perfume | undefined;
  showDetails: boolean = false;
  showNotes: boolean = false;


  router = inject(Router);

  toggleNotes() {
    this.showNotes = !this.showNotes;
  }
  addToCart(event: any): void {
    if (!this.perfume) return;
    console.log('Added to cart:', this.perfume.name);
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

