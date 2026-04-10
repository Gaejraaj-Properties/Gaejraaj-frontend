export type UserRole = "buyer" | "seller" | "agent" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  fullProfileUrl: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  savedProperties: string[];
  createdAt: string;
}

export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "plot"
  | "commercial"
  | "farmhouse"
  | "pg"
  | "studio";

export type ListingType = "sale" | "rent" | "lease";
export type PropertyStatus = "pending" | "approved" | "rejected" | "sold" | "rented";

export interface PropertyImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  coordinates: { lat: number; lng: number };
}

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  priceType: "fixed" | "negotiable";
  area: { value: number; unit: "sqft" | "sqm" | "sqyard" };
  bedrooms: number;
  bathrooms: number;
  floors: number;
  totalFloors: number;
  furnishing: "unfurnished" | "semi-furnished" | "fully-furnished";
  facing: string;
  age: number;
  location: PropertyLocation;
  images: PropertyImage[];
  amenities: string[];
  owner: User | string;
  isFeatured: boolean;
  views: number;
  postedAt: string;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property: string | Property;
  status: "pending" | "responded" | "closed";
  createdAt: string;
}

export interface PaginatedResponse<T> {
  status: string;
  results: number;
  totalPages: number;
  currentPage: number;
  data: { properties?: T[]; users?: T[]; inquiries?: T[] };
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  type?: PropertyType | "";
  listingType?: ListingType | "";
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  status?: PropertyStatus | "";
  page?: number;
  limit?: number;
}
