import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(customer?: string): Promise<import("./schemas/review.schema").Review[]>;
    create(reviewDto: ReviewDto): Promise<import("./schemas/review.schema").Review>;
    updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<import("./schemas/review.schema").Review>;
    delete(id: string): Promise<import("./schemas/review.schema").Review>;
}
