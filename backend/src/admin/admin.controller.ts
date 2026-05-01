import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
// Later add JwtAuthGuard and RolesGuard

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getOverview() {
    return this.adminService.getDashboardOverview();
  }
}
