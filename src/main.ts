import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    if (req.method == 'OPTIONS') {
      console.log('method===>', req.method);
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET',
      );
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return res.status(200).json({});
    }
    next();
  });
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://192.168.1.67:3000',
        'http://primescapeapi.xyz:5004/',
      ], // Replace '*' with the specific origin you want to allow or use a function to validate multiple origins
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      credentials: true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
    }),
  );

  //app.options('/entry/:id', cors())

  //swagger setup
  const config = new DocumentBuilder()
    .setTitle('Game API')
    .setDescription(
      'The Game API. API description the crud operation and search engine for game',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on port ' + process.env.PORT || 8080);
  });
}

bootstrap();
