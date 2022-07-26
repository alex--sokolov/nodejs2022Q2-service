import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { dirname, join, resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { cwd } from 'process';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(cwd(), '.env') });
const port = process.env.PORT || 4000;

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
    }),
  );
  await app.listen(port).then(() => console.log('Server started at ', port));
}
bootstrap();
