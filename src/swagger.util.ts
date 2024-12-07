import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwaggerDocs = (app: INestApplication): any => {
  const config = new DocumentBuilder()
    .setTitle(`Health  Zone API Documentation`)
    .setDescription(
      `API routes & references for the Health  Zone NestJS server`,
    )
    .addBearerAuth()
    .build();

  const documentOptions: SwaggerDocumentOptions = {};

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const swaggerOptions: SwaggerCustomOptions = {
    customSiteTitle: `Health  Zone API Docs`,
  };

  SwaggerModule.setup('/swagger', app, document, swaggerOptions);

  return document;
};
