import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Perfume } from '../models/perfume.model';

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  private perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Nile Essence',
      country: 'Egypt',
      description: 'Captures the mystique of ancient Egypt with exotic spices and floral notes from the Nile valley.',
      price: 89.99,
      imageUrl: 'assets/images/egypt-perfume.jpg',
      features: ['Long-lasting', 'Exotic', 'Unisex', 'Evening wear'],
      notes: {
        top: ['Bergamot', 'Green Notes', 'Lemon'],
        middle: ['Lotus', 'Jasmine', 'Lily'],
        base: ['Amber', 'Musk', 'Sandalwood', 'Vanilla']
      }
    },
    {
      id: 2,
      name: 'Mediterranean Breeze',
      country: 'Spain',
      description: 'Evokes the sunny coasts of Spain with vibrant citrus and aromatic herbal notes.',
      price: 79.99,
      imageUrl: 'assets/images/spain-perfume.jpg',
      features: ['Fresh', 'Summer', 'Energetic', 'Day wear'],
      notes: {
        top: ['Lemon', 'Mandarin', 'Bergamot'],
        middle: ['Orange Blossom', 'Lavender', 'Rosemary'],
        base: ['Cedar', 'Vanilla', 'Tonka Bean']
      }
    },
    {
      id: 3,
      name: 'Sakura Dream',
      country: 'Japan',
      description: 'Delicate floral fragrance inspired by Japanese cherry blossoms and tea ceremonies.',
      price: 95.99,
      imageUrl: 'assets/images/japan-perfume.jpg',
      features: ['Elegant', 'Floral', 'Romantic', 'Special occasions'],
      notes: {
        top: ['Cherry Blossom', 'Pear', 'Green Tea'],
        middle: ['Rose', 'Peony', 'Orchid'],
        base: ['Musk', 'Woody Notes', 'Amber']
      }
    },
    {
      id: 4,
      name: 'Parisian Chic',
      country: 'France',
      description: 'Sophisticated blend that embodies the elegance of Paris with classic floral notes.',
      price: 109.99,
      imageUrl: 'assets/images/france-perfume.jpg',
      features: ['Luxurious', 'Timeless', 'Feminine', 'Evening wear'],
      notes: {
        top: ['Peach', 'Black Currant', 'Bergamot'],
        middle: ['Rose', 'Jasmine', 'Lily of the Valley'],
        base: ['Patchouli', 'Vanilla', 'Sandalwood']
      }
    },
    {
      id: 5,
      name: 'Tropical Nights',
      country: 'Brazil',
      description: 'Exotic and sensual fragrance with tropical fruits and rich vanilla.',
      price: 84.99,
      imageUrl: 'assets/images/brazil-perfume.jpg',
      features: ['Sensual', 'Warm', 'Exotic', 'Night wear'],
      notes: {
        top: ['Passion Fruit', 'Mango', 'Lime'],
        middle: ['Tuberose', 'Jasmine', 'Orchid'],
        base: ['Vanilla', 'Amber', 'Sandalwood']
      }
    }
  ];

  constructor(private http: HttpClient) { }

  getAllPerfumes(): Observable<Perfume[]> {
    return of(this.perfumes);
  }

  getPerfumesByCountry(country: string): Observable<Perfume[]> {
    return of(this.perfumes.filter(p => p.country.toLowerCase() === country.toLowerCase()));
  }

  getPerfumeById(id: number): Observable<Perfume | undefined> {
    return of(this.perfumes.find(p => p.id === id));
  }

  getCountries(): Observable<string[]> {
    const countries = [...new Set(this.perfumes.map(p => p.country))];
    return of(countries.sort());
  }

  getFeaturedPerfumes(): Observable<Perfume[]> {
    return of([this.perfumes[0], this.perfumes[2], this.perfumes[4]]);
  }
}
