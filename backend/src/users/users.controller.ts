import {
  Controller,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    if (!req.user) throw new BadRequestException('User not authenticated');
    
    // Prevent updating sensitive fields
    const { phone, role, ...safeData } = updateData;
    
    return this.usersService.update(req.user.userId, safeData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    
    const result = await this.cloudinaryService.uploadImage(file);
    const updatedUser = await this.usersService.updateProfileImage(req.user.userId, result.secure_url);
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('wishlist')
  async getWishlist(@Request() req) {
    return this.usersService.getWishlist(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wishlist/:productId')
  async toggleWishlist(@Request() req, @Param('productId') productId: string) {
    return this.usersService.toggleWishlist(req.user.userId, productId);
  }
}
