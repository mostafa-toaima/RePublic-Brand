import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfumeService } from '../../services/perfume.service';
import { Perfume } from '../../models/perfume.model';

@Component({
  selector: 'custom-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // fix: should be style**Urls**
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  router = inject(Router);
  perfumeService = inject(PerfumeService);

  ngOnInit() {
    this.getCartItemCount();
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

  getCartItemCount() {
    this.perfumeService.getAllPerfumes().subscribe(item => {
      this.cartItemCount = item.filter((perfume: Perfume) => perfume.inCart).length;
    });
  }

  exploreCollectionFor(type: string) {
    this.router.navigate(['/products'], { queryParams: { type } });
  }

}
