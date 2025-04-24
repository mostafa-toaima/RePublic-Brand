import { Perfume } from "./perfume.model";

export interface Cart {
  perfume: Perfume;
  quantity: number;
  size?: string;
}
