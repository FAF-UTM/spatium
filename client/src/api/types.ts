// Shared API response types matching the backend CMS.

export type Lang = 'ro' | 'ru' | 'en';

export interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: User;
}

export interface MeResponse {
  success: true;
  user: User;
}

export interface GalleryImage {
  url: string;
  publicId: string;
}

// News / Projects / Gallery all share this multilingual "card" shape.
export interface Card {
  _id: string;
  img: string;
  imagePublicId: string;
  images: GalleryImage[];
  title_ro: string;
  title_ru: string;
  title_en: string;
  description_ro: string;
  description_ru: string;
  description_en: string;
  date: string;
  to: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  _id: string;
  link: string;
  type: string;
  title_ro: string;
  title_ru: string;
  title_en: string;
  content_ro: string;
  content_ru: string;
  content_en: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListResponse<T> {
  success: true;
  data: T[];
}

export interface ItemResponse<T> {
  success: true;
  data: T;
}

export type CardResource = 'news' | 'projects' | 'gallery';
