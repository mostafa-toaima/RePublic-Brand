import { Injectable } from '@angular/core';
import { Perfume } from '../../../common/models/perfume.model';
import { PerfumeService } from '../../../common/services/perfume.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private perfumeService: PerfumeService) { }

  updateCart(perfume: Perfume, value: boolean, field: any): void {
    if (!perfume.id) {
      console.error('Cannot add to cart: Perfume has no ID.');
      return;
    }
    const { id, ...rest } = perfume;
    this.perfumeService.updatePerfume(id, {
      ...rest,
      [field]: value
    })
      .then(() => {
        console.log('Perfume added to cart successfully.');
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
  }

  addToWishlist(perfume: Perfume): void {
    this.updateCart(perfume, true, 'inWishlist');
  }

  removeFromWishlist(perfume: Perfume): void {
    this.updateCart(perfume, false, 'inWishlist');
  }


}
