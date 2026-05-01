import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { SettingDto } from './dto/setting.dto';
export declare class SettingsService {
    private settingModel;
    constructor(settingModel: Model<Setting>);
    getSettings(): Promise<Setting>;
    updateSettings(dto: SettingDto): Promise<Setting>;
}
