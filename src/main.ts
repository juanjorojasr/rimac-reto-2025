import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	logger.log('🚀 Iniciando aplicación NestJS...');

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	const port = process.env.PORT ?? 3000;
	await app.listen(port);

	logger.log(`✅ Aplicación escuchando en puerto ${port}`);
	logger.log(`🌐 URL: http://localhost:${port}`);

	app.enableShutdownHooks();

	process.on('SIGTERM', async () => {
		logger.warn('SIGTERM recibido, cerrando aplicación...');
		await app.close();
		logger.log('Aplicación cerrada correctamente');
	});
}
bootstrap();
