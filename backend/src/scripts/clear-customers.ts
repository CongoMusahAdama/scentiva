import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CustomersService } from '../customers/customers.service';
import { UsersService, ADMIN_CREDENTIALS } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const customersService = app.get(CustomersService);
  const usersService = app.get(UsersService);

  const customerRecords = await customersService.deleteAll();
  const customerAccounts = await usersService.deleteAllCustomers();

  console.log(`✅ Deleted ${customerRecords} customer records`);
  console.log(`✅ Deleted ${customerAccounts} customer accounts (admin kept)`);
  console.log('Admin login credentials:');
  console.log(`  Email:    ${ADMIN_CREDENTIALS.email}`);
  console.log(`  Phone:    ${ADMIN_CREDENTIALS.phone}`);
  console.log(`  Password: ${ADMIN_CREDENTIALS.password}`);

  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ Clear customers failed:', error);
  process.exit(1);
});
