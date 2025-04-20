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
      name: 'egypt',
      country: 'Egypt',
      description: 'A floral-fruity scent that blends jasmine and strawberry for a fresh, captivating fragrance inspired by the beauty of the Nile.',
      price: 500.00,
      images: [
        '../../../assets/images/egypt-perfume..jpg',
        '../../../assets/images/egypt.jpg',
      ],
      features: ['woman', 'daily use', 'inspired by Burberry her'],
      category: 'woman',
      isNew: false,
      isBestSeller: true,
      details: 'Named after Egypt for its core notes of jasmine and strawberry — Egypt is the world’s No.1 producer of jasmine and ranks third globally in strawberry production. Its fresh aroma perfectly mirrors the Egyptian breeze.',
      notes: {
        top: ['Strawberry', 'Berries', 'Mandarin', 'Lemon'],
        middle: ['Jasmine', 'Floral Notes'],
        base: ['Vanilla', 'Musk', 'Amber', 'Patchouli', 'Woods']
      }
    },
    {
      id: 2,
      name: 'spain',
      country: 'Spain',
      description: 'Warm and indulgent — a sweet blend of vanilla, caramel, and golden honey that wraps you in Mediterranean comfort.',
      price: 500.00,
      images: [
        '../../../assets/images/b-spain.jpg',
        '../../../assets/images/spain.jpg',
      ],
      features: ['Warm', 'Occupation', 'inspired by Bianco latte'],
      category: 'unisex',
      isNew: false,
      isBestSeller: true,
      details: 'Named after Spain due to its warm ingredients that reflect the country’s sunny, Mediterranean climate all year round.',
      notes: {
        top: ['Caramel'],
        middle: ['Honey', 'Coconut'],
        base: ['Vanilla', 'White Musk']
      }
    },
    {
      id: 3,
      name: 'guatemala',
      country: 'Guatemala',
      description: 'Mysterious and bold — a sensual mix of basil and woods that leaves a sexy, unforgettable trail.',
      price: 500.00,
      images: [
        '../../../assets/images/b-guatemala.jpg',
        '../../../assets/images/guatemala.jpg',
      ],
      features: ['Fresh', 'Summer', 'Energetic', 'inspired by La Nuit de l', 'Homme'],
      category: 'men',
      isNew: false,
      isBestSeller: true,
      details: 'Named after Guatemala as it’s the world’s top producer of cardamom — the perfume’s bold, spicy opening note.',
      notes: {
        top: ['Cardamom'],
        middle: ['Lavender', 'Cedarwood', 'Bergamot'],
        base: ['Vetiver', 'Caraway']
      }
    },
    {
      id: 4,
      name: 'greece',
      country: 'Greece',
      description: 'A splash of citrus breeze with mandarin and orange — crisp, clean, and full of Aegean freshness.',
      price: 500.00,
      images: [
        '../../../assets/images/b-greece.jpg',
        '../../../assets/images/greece.jpg',
      ],
      features: ['Fresh', 'Summer', 'Energetic', 'Day wear', 'inspiredby allure homme sport'],
      category: 'men',
      isNew: false,
      isBestSeller: false,
      details: 'Named after Greece thanks to its refreshing marine and citrus notes that transport you to a sunny Greek beach.',
      notes: {
        top: ['Marine Notes', 'Mandarin', 'Orange', 'Bergamot'],
        middle: ['Pepper', 'Woody Notes'],
        base: ['Musk', 'Amber', 'Vanilla', 'Tonka Bean']
      }
    },
    {
      id: 5,
      name: 'oman',
      country: 'Oman',
      description: 'An oriental delight with rich notes of cinnamon, dates, almond, and vanilla — capturing the heart of Arabian nights.',
      price: 500.00,
      images: [
        '../../../assets/images/b-oman.jpg',
        '../../../assets/images/oman.jpg',
      ],
      features: ['Fresh', 'Summer', 'Energetic', 'inspired by khamra'],
      category: 'unisex',
      isNew: false,
      isBestSeller: false,
      details: 'Named after Oman for its rich Middle Eastern essence — featuring dates, almond, and spices that reflect the soul of Arabian heritage.',
      notes: {
        top: ['Cinnamon', 'Nutmeg', 'Bergamot'],
        middle: ['Dates', 'Almond Candy', 'Musk'],
        base: ['Vanilla', 'Tonka Bean', 'Woods']
      }
    },
    {
      id: 6,
      name: 'england',
      country: 'England',
      description: 'A unique blend of green apple, cardamom, and vanilla — mysterious, elegant, and undeniably British.',
      price: 500.00,
      images: [
        '../../../assets/images/b-england.jpg',
        '../../../assets/images/england.jpg',
      ],
      features: ['inspired by Layton', 'Energetic', 'Day wear'],
      category: 'unisex',
      isNew: true,
      isBestSeller: false,
      details: 'Named after England for its mysterious and elegant character — inspired by London’s foggy charm and influenced by Parfums de Marly’s Layton, also the name of an English football club.',
      notes: {
        top: ['Green Apple', 'Bergamot', 'Lavender', 'Mandarin'],
        middle: ['Jasmine', 'Cardamom', 'Woody Notes'],
        base: ['Vanilla', 'Patchouli', 'Pepper', 'Sandalwood']
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
