import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //validacion global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  
  // Configuración Swagger
  // const config = new DocumentBuilder()
  //   .setTitle('Microservicio de Calendario')
  //   .setDescription('Documentación de la API para el módulo de eventos del dashboard')
  //   .setVersion('1.0')
  //   .addTag('calendar')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document); // se accede en /api
 app.enableCors({
    origin: 'http://localhost:3000',  // corregido el protocolo
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;


  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
