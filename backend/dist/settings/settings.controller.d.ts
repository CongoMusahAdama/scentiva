import { SettingsService } from './settings.service';
import { SettingDto } from './dto/setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("./schemas/setting.schema").Setting>;
    updateSettings(dto: SettingDto): Promise<import("./schemas/setting.schema").Setting>;
}
