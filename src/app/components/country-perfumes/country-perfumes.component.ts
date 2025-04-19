import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Perfume } from '../../common/models/perfume.model';
import { PerfumeService } from '../../common/services/perfume.service';


@Component({
  selector: 'app-country-perfumes',
  templateUrl: './country-perfumes.component.html',
  styleUrls: ['./country-perfumes.component.css']
})
export class CountryPerfumesComponent implements OnInit {
  country: string = '';
  perfumes: Perfume[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private perfumeService: PerfumeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      this.loadPerfumes();
    });
  }

  private loadPerfumes(): void {
    this.isLoading = true;
    this.perfumeService.getPerfumesByCountry(this.country).subscribe(perfumes => {
      this.perfumes = perfumes;
      this.isLoading = false;
    });
  }
}
