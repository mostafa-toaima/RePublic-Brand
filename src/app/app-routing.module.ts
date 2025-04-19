import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryPerfumesComponent } from './components/country-perfumes/country-perfumes.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'country/:country', component: CountryPerfumesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
