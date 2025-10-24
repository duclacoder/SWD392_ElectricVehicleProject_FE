export interface Vehicle {
  id: number;
  user_id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price?: number;
  battery_status?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  status: string;
  images?: string[];
}
