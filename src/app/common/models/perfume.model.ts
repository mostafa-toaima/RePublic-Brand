export interface Perfume {
  id: number;
  name: string;
  details: string;
  country: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}
