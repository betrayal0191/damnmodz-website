export const ITEM_TYPES = ['Key', 'In-Game item', 'Account', 'Subscription'] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  affiliate_fee: number;
  item_type: ItemType;
  content: string;
  additional_info: string | null;
  activation_instructions: string | null;
  languages: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
