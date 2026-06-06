import { string } from "zod";
import { ApiBaseResponse } from "~/types";

export interface HomePageData {
  createdAt: string;
  documentId: string;
  heroSubtitle: string;
  heroTitle: string;
  description: string;
  testimonials: Testimonial[];
  heroPicture: {
    width: number;
    height: number;
    url: string;
  };
  aboutTheBook: string;
  aboutTheAuthor: string;
  author_credentials: AuthorCredentials[];
  id: number;
  uploadedFiles: UploadedFile[];
  publishedId: string;
  updatedAt: string;
}

interface AuthorCredentials {
  description: string;
  icon: string;
}
export type HomePageDataResponse = ApiBaseResponse<HomePageData>;

export interface UploadedFile {
  id: number;
  name: string;
  ext: string;
  mime: string;
  size: number; // KB
  url: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  reviewerName: string;
  reviewerTitle: string;
  rating: number;
  source: string;
  sourceUrl: string;
}
