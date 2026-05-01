import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}

  async getSettings(): Promise<Setting> {
    const settings = await this.settingModel.findOne();
    if (!settings) {
      // Create default settings if none exist
      return await this.settingModel.create({});
    }
    return settings;
  }

  async updateSettings(dto: SettingDto): Promise<Setting> {
    const settings = await this.settingModel.findOne();
    if (!settings) {
      return await this.settingModel.create(dto);
    }
    const updated = await this.settingModel.findOneAndUpdate({}, dto, { new: true });
    if (!updated) {
       throw new Error("Failed to update settings");
    }
    return updated;
  }
}
