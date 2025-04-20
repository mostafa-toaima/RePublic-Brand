import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Perfume } from '../models/perfume.model';

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
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


}
