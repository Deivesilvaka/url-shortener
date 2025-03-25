import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@src/config/swagger.config';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: process.env.NODE_ENV !== 'prd',
      validateCustomDecorators: true,
    }),
  );

  if (process.env.NODE_ENV !== 'prd') {
    setupSwagger(app);
  }

  await app.listen(process.env.APP_PORT || 3000, () => {
    console.log('App is running');
  });
}
bootstrap();
