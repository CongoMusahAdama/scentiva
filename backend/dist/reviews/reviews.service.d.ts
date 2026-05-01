import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { ReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private reviewModel;
    constructor(reviewModel: Model<Review>);
    findAll(): Promise<Review[]>;
    findByCustomer(customerName: string): Promise<Review[]>;
    create(reviewDto: ReviewDto): Promise<Review>;
    updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Review>;
    delete(id: string): Promise<Review>;
}
