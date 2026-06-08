import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    updateProfile(req: any, updateData: UpdateProfileDto): Promise<import("./schemas/user.schema").User | null>;
    uploadProfileImage(req: any, file: Express.Multer.File): Promise<import("./schemas/user.schema").User>;
    getWishlist(req: any): Promise<import("../products/schemas/product.schema").Product[]>;
    toggleWishlist(req: any, productId: string): Promise<string[]>;
}
