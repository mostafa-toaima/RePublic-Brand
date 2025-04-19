import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Perfume } from '../../common/models/perfume.model';
import { PerfumeService } from '../../common/services/perfume.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredPerfumes: Perfume[] = [];
  isLoading = true;

  constructor(
    private perfumeService: PerfumeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.perfumeService.getFeaturedPerfumes().subscribe(perfumes => {
      this.featuredPerfumes = perfumes;
      this.isLoading = false;
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.location.hash) {
          setTimeout(() => {
            document.querySelector(window.location.hash)?.scrollIntoView({
              behavior: 'smooth'
            });
          }, 0);
        }
      });
  }

  onCountrySelected(country: string): void {
    this.router.navigate(['/country', country]);
  }


  scrollToContent() {
    document.getElementById('main-content')?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
