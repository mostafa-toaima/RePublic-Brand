import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Perfume } from '../../../common/models/perfume.model';
import { PerfumesService } from '../services/perfumes.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProducts: Perfume[] = [];
  displayedProducts: Perfume[] = [];
  filteredProducts: Perfume[] = [];

  isLoading: boolean = true;
  showFilter: boolean = false;

  categories: string[] = [];
  countries: string[] = [];

  selectedCategory: string = 'ALL';
  selectedCountry: string = 'ALL';
  sortOption: string = 'featured';

  currentPage: number = 1;
  productsPerPage: number = 3;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  private destroy$ = new Subject<void>();
  private perfumeService = inject(PerfumesService);

  constructor(private route: ActivatedRoute, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.initializeComponent();
    this.viewportScroller.scrollToPosition([0, 0])

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.setupRouteListener();
    this.loadProducts();
  }

  private setupRouteListener(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params.get('type')) {
          this.selectedCategory = params.get('type') || 'ALL';
        } else if (params.get('country')) {
          this.selectedCountry = params.get('country') || 'ALL';
        }
        if (this.allProducts.length) {
          this.applyFilters();
        }
      });
  }

  loadProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.perfumeService.getAllPerfumes()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (products: Perfume[]) => {
            this.handleProductsLoad(products);
          },
          error: () => {
            this.isLoading = false;
          }
        });
    }, 1000);
  }

  private handleProductsLoad(products: Perfume[]): void {
    this.allProducts = products;

    this.categories = this.perfumeService.getUniqueCategories(products);
    this.countries = this.perfumeService.getUniqueCountries(products);

    this.applyFilters();
    this.isLoading = false;
  }

  applyFilters(): void {
    const filtered = this.perfumeService.filterAndSortPerfumes(
      this.allProducts,
      this.selectedCategory,
      this.selectedCountry,
      this.sortOption
    );

    this.filteredProducts = filtered;
    this.updatePagination();
    this.updateDisplayedProducts();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateDisplayedProducts(): void {
    this.displayedProducts = this.perfumeService.paginateProducts(
      this.filteredProducts,
      this.currentPage,
      this.productsPerPage
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
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

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleShowFilter(): void {
    this.showFilter = !this.showFilter;
  }

  resetFilters(event: Event): void {
    event.stopPropagation();
    this.selectedCategory = 'ALL';
    this.selectedCountry = 'ALL';
    this.sortOption = 'featured';
    this.applyFilters();
  }

  scrollToContent(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  trackById(index: number, perfume: Perfume): string {
    return perfume.id || index.toString();
  }
}
