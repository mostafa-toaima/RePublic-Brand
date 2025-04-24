import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfume } from '../../../common/models/perfume.model';
import { PerfumeService } from '../../../common/services/perfume.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  allProducts: Perfume[] = [];
  displayedProducts: Perfume[] = [];
  filteredProducts: Perfume[] = [];
  isLoading: boolean = true;
  categories: string[] = [];
  countries: string[] = [];

  currentPage: number = 1;
  productsPerPage: number = 4;
  totalPages: number = 1;

  selectedCategory: string = 'all';
  selectedCountry: string = 'all';
  sortOption: string = 'featured';
  showFilter: boolean = false;

  perfumeService = inject(PerfumeService)
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('type')) {
        this.selectedCategory = params.get('type') || 'all';
      }
      this.loadProducts();
    });
  }
  loadProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.perfumeService.getAllPerfumes().subscribe((products: Perfume[]) => {
        this.allProducts = products;
        this.filteredProducts = [...this.allProducts];
        this.categories = ['All', ...new Set(this.allProducts.map(p => p.category))];
        this.countries = ['All', ...new Set(this.allProducts.map(p => p.country))];
        this.applyFilters();
        this.isLoading = false;
      });

      this.filteredProducts = [...this.allProducts];
      this.categories = ['all', ...new Set(this.allProducts.map(p => p.category))];
      this.countries = ['all', ...new Set(this.allProducts.map(p => p.country))];

      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  applyFilters(): void {
    let filtered = this.allProducts;
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    if (this.selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.country === this.selectedCountry);
    }
    switch (this.sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updatePagination();
    this.updateDisplayedProducts();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, startIndex + this.productsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  addToCart(product: Perfume): void {
    // In a real app, you would call your cart service here
    console.log('Added to cart:', product);
    // this.cartService.addToCart(product);
  }

  toggleShowFilter() {
    this.showFilter = !this.showFilter;
  }

  resetFilters(event: any): void {
    event.stopPropagation();
    this.selectedCategory = 'all';
    this.selectedCountry = 'all';
    this.sortOption = 'featured';
    this.applyFilters();
  }

  scrollToContent() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  trackById(index: number, perfume: Perfume): string {
    return perfume.id || '';
  }

}
