export interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  timeDescription: string;
  locality?: string; // Neighborhood or area in Amritsar
  originalReviewObject?: any;
}

export interface ClinicDetails {
  placeId: string;
  name: string;
  rating?: number;
  userRatingCount?: number;
  formattedAddress?: string;
  reviews?: Review[];
  weekdayDescriptions?: string[];
  isOpenNow?: boolean;
}

export interface AppointmentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  message: string;
  preferredDate: string;
}
