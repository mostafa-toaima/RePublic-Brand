import { Injectable } from '@angular/core';
import { Perfume } from '../../../common/models/perfume.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PerfumesService {

  constructor(private firestore: AngularFirestore) { }

  getAllPerfumes(): Observable<Perfume[]> {
    return this.firestore.collection<Perfume>('perfumes').valueChanges({ idField: 'id' });
  }


  getPerfumesByCountry(country: string): Observable<Perfume[]> {
    return this.firestore.collection<Perfume>('perfumes', ref =>
      ref.where('country', '==', country)
    ).valueChanges({ idField: 'id' });
  }

  getPerfumeById(id: string): Observable<Perfume | undefined> {
    return this.firestore.doc<Perfume>(`perfumes/${id}`).valueChanges();
  }

  getPerfumeByCountry(country: string): Observable<Perfume[]> {
    return this.firestore.collection<Perfume>('perfumes', ref =>
      ref.where('country', '==', country)
    ).valueChanges({ idField: 'id' });
  }

  getCountries(): Observable<string[]> {
    return this.firestore.collection<Perfume>('perfumes').valueChanges()
      .pipe(
        map((perfumes: Perfume[]) => {
          console.log('Perfumes:', perfumes);

          const countries = [...new Set(perfumes.map((p: Perfume) => p.country))];
          return countries.sort();
        })
      );
  }

  getFeaturedPerfumes(): Observable<Perfume[]> {
    return this.firestore.collection<Perfume>('perfumes', ref =>
      ref.where('isBestSeller', '==', true).limit(3)
    ).valueChanges({ idField: 'id' });
  }

  updatePerfume(id: any, data: Partial<Perfume>): Promise<void> {
    return this.firestore.doc<Perfume>(`perfumes/${id}`).update(data);
  }


  filterAndSortPerfumes(
    perfumes: Perfume[],
    category: string,
    country: string,
    sortOption: string
  ): Perfume[] {
    let result = [...perfumes];

    if (category !== 'ALL') {
      result = result.filter(p => p.category === category);
    }

    if (country !== 'ALL') {
      result = result.filter(p => p.country === country);
    }

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }

  paginateProducts(products: Perfume[], currentPage: number, perPage: number): Perfume[] {
    const start = (currentPage - 1) * perPage;
    return products.slice(start, start + perPage);
  }

  getUniqueCategories(products: Perfume[]): string[] {
    return ['ALL', ...new Set(products.map(p => p.category))];
  }

  getUniqueCountries(products: Perfume[]): string[] {
    return ['ALL', ...new Set(products.map(p => p.country))];
  }
}
