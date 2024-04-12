import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
const port = process.env.PORT;
async function bootstrap() {
  process.env.TZ = 'America/Caracas';
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const authOptions = new DocumentBuilder()
    .setTitle('Andromeda')
    .setDescription('API for the Andromeda')
    .setVersion('1.0')
    .addTag('Andromeda')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-authenticate',
    )
    .build();
  const authDocument = SwaggerModule.createDocument(app, authOptions);
  SwaggerModule.setup('andromeda-api', app, authDocument);
  await app.listen(port);
}

bootstrap();
