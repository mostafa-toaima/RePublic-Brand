import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PerfumeCardComponent } from './components/products/perfume-card/perfume-card.component';
import { HomeComponent } from './components/home/home.component';
import { CountryMapComponent } from './components/country-map/country-map.component';
import { PerfumeDetailsComponent } from './components/products/perfume-details/perfume-details.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PerfumeCardComponent,
    CountryMapComponent,
    
    PerfumeDetailsComponent,
    NavbarComponent,
    FooterComponent,
    ProductsComponent
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
