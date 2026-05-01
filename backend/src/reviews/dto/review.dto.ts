export class ReviewDto {
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
}
