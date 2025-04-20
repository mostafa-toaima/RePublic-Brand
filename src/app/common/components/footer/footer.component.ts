import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  router = inject(Router);
  exploreCollectionFor(type: string) {
    this.router.navigate(['/products'], { queryParams: { type } });
  }
}
