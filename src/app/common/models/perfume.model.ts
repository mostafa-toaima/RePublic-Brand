export interface Perfume {
  id: number;
  name: string;
  country: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}
