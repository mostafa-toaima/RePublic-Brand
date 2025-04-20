import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfumeService } from '../../common/services/perfume.service';
import { Perfume } from '../../common/models/perfume.model';

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

  // Pagination
  currentPage: number = 1;
  productsPerPage: number = 12;
  totalPages: number = 1;

  // Filters
  selectedCategory: string = 'all';
  selectedCountry: string = 'all';
  sortOption: string = 'featured';
  showFilter: boolean = false;

  perfumeService = inject(PerfumeService)
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts(): void {
    this.isLoading = true;

    // Simulate API call with timeout
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
    // Apply category filter
    let filtered = this.allProducts;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Apply country filter
    if (this.selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.country === this.selectedCountry);
    }

    // Apply sorting
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
        // 'featured' - default sorting
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

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
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
}
