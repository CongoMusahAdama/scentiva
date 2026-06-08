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
import { UpdateProfileDto } from './dto/update-profile.dto';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    if (!req.user) throw new BadRequestException('User not authenticated');
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image must be under 5MB');
    }

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
