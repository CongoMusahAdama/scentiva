"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_setup_1 = require("./app.setup");
async function bootstrap() {
    const app = await (0, app_setup_1.createApp)();
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map