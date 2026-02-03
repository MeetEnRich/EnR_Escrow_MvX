import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('escrow');

  const config = new DocumentBuilder()
    .setTitle('Escrow Services API')
    .setDescription('API documentation for Escrow Services')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, { useGlobalPrefix: true });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
