import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAll(@Query('customer') customer?: string) {
    if (customer) {
      return this.reviewsService.findByCustomer(customer);
    }
    return this.reviewsService.findAll();
  }

  @Post()
  async create(@Body() reviewDto: ReviewDto) {
    return this.reviewsService.create(reviewDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'rejected',
  ) {
    return this.reviewsService.updateStatus(id, status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
