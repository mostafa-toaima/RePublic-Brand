import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfumeCardComponent } from './components/products/components/perfume-card/perfume-card.component';
import { HomeComponent } from './components/home/home.component';
import { CountryMapComponent } from './components/country-map/country-map.component';
import { PerfumeDetailsComponent } from './components/products/components/perfume-details/perfume-details.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { CartComponent } from './components/products/components/cart/cart.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environment';
import { ProductsComponent } from './components/products/components/products.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PerfumeCardComponent,
    CountryMapComponent,
    PerfumeDetailsComponent,
    NavbarComponent,
    FooterComponent,
    ProductsComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
