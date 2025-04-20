export interface Perfume {
  id?: string;
  name: string;
  details: string;
  country: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  features: string[];
  category: string;
  isNew?: boolean;
  inCart?: boolean;
  inWishlist?: boolean;
  isBestSeller?: boolean;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}
