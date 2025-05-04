import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Perfume } from '../../common/models/perfume.model';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredPerfumes: Perfume[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }

  exploreCollection() {
    this.router.navigate(['/products']);
  }

  onCountrySelected(country: string): void {
    this.router.navigate(['/products'], { queryParams: { country } });
  }

  exploreCollectionFor(type: string) {
    this.router.navigate(['/products'], { queryParams: { type } });
  }
}
