import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/global-exception-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    const swaggerConfig = new DocumentBuilder()
        .setTitle('To-do-list Docs')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
        },
    });

    await app.listen(process.env.PORT || 3000);
    console.info(`listening on port: ${process.env.PORT}`);
}

bootstrap();
