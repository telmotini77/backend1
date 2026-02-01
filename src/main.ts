// c:\Users\telmo\backend1\src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importa ValidationPipe
import { SeedService } from './users/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
      transform: true, // Transforma los payloads a instancias de DTO
    }),
  );

  // Ensure all modules (incl. TypeORM) are initialized before seeding
  await app.init();
  try {
    const seedService = app.get(SeedService);
    await seedService.seedAdmin();
  } catch (err) {
    // Don't crash the app if seeding fails; log for debugging
    // eslint-disable-next-line no-console
    console.error('Seed error:', err);
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
