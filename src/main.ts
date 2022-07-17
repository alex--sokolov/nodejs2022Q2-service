import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {readFile} from "fs/promises";
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { dirname, join } from 'path';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }
      }),
  );
  await app.listen(4000);
}
bootstrap();
