import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PerfumeService } from '../../common/services/perfume.service';

@Component({
  selector: 'app-country-filter',
  templateUrl: './country-filter.component.html',
  styleUrls: ['./country-filter.component.css']
})
export class CountryFilterComponent implements OnInit {
  countries: string[] = [];
  selectedCountry: string = '';
  @Output() countrySelected = new EventEmitter<string>();

  constructor(private perfumeService: PerfumeService) { }

  ngOnInit(): void {
    this.perfumeService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onCountryChange(): void {
    this.countrySelected.emit(this.selectedCountry);
  }
}
