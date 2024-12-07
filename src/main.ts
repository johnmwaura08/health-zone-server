import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwaggerDocs } from './swagger.util';

const port = process.env.PORT || 3009;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  await initSwaggerDocs(app);
  await app.listen(port, '0.0.0.0');

  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
