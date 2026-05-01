import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByCustomer(customerName: string): Promise<Review[]> {
    return this.reviewModel.find({ customer: customerName }).sort({ createdAt: -1 }).exec();
  }

  async create(reviewDto: ReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(reviewDto);
    return createdReview.save();
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  }

  async delete(id: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  }
}
