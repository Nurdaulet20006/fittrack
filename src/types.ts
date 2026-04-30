export interface Gym {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  rating: number;
  reviewCount: number;
  monthlyPrice: number;
  amenities: string[];
  phone: string;
  description: string;
  workingHours: string;
  website: string;
  photos: string[];
  googleMapsUrl?: string;
}

export interface Review {
  id: string;
  gymId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: any;
}

export interface Favorite {
  id: string;
  userId: string;
  gymId: string;
}

export interface AIPlanData {
  id: string;
  userId: string;
  plan: any;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
  experience?: string;
  daysPerWeek?: number;
  injuries?: string;
  diseases?: string;
  foodPreferences?: string;
}
