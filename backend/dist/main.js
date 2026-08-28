"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dns = require("dns");
try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
}
catch {
}
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'https://scentivaaura.shop',
        'https://www.scentivaaura.shop',
        'http://localhost:3000',
    ].filter(Boolean);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    });
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map