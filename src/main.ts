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

  // Security & production settings
  if (process.env.NODE_ENV === 'production') {
    // Enable stricter CORS policy in production if provided
    const corsOrigin = process.env.CORS_ORIGIN ?? '';
    if (corsOrigin) {
      app.enableCors({ origin: corsOrigin, credentials: true });
    } else {
      app.enableCors();
    }

    // Use helmet and compression (import dynamically to avoid compile-time dependency)
    try {
      // Use require at runtime so TypeScript doesn't need types installed. eslint rule disabled for this call.
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      const helmetModule = require('helmet');
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      const compressionModule = require('compression');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      app.use(helmetModule());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      app.use(compressionModule());
    } catch {
      // If something unexpected happens, log a warning but don't crash

      console.warn(
        'Optional security packages (helmet/compression) not functional. Install them for better security.',
      );
    }

    app.setGlobalPrefix('api');
  }

  if (process.env.NODE_ENV !== 'production') {
    try {
      const seedService = app.get(SeedService);
      await seedService.seedAdmin();
    } catch (err) {
      console.error('Seed error:', err);
    }
  } else {
    console.log('Production environment detected: skipping DB seed.');
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
