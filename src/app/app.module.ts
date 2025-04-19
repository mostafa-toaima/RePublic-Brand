import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PerfumeCardComponent } from './components/perfume-card/perfume-card.component';
import { CountryFilterComponent } from './components/country-filter/country-filter.component';
import { HomeComponent } from './components/home/home.component';
import { CountryMapComponent } from './components/country-map/country-map.component';
import { PerfumeDetailsComponent } from './components/perfume-details/perfume-details.component';
import { CountryPerfumesComponent } from './components/country-perfumes/country-perfumes.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { FooterComponent } from './common/components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PerfumeCardComponent,
    CountryMapComponent,
    CountryPerfumesComponent,
    PerfumeDetailsComponent,
    CountryFilterComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
