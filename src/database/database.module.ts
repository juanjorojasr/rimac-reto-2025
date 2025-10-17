import { Module, Global, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'mysql2/promise';
import * as mysql from 'mysql2/promise';

@Global()
@Module({
	providers: [
		{
			provide: 'DATABASE_POOL',
			useFactory: async (configService: ConfigService): Promise<Pool> => {
				const logger = new Logger('DatabaseModule');

				logger.log('🔄 Creando pool de conexiones...');

				const host = configService.get<string>('database.host');
				const port = configService.get<number>('database.port');
				const user = configService.get<string>('database.user');
				const password = configService.get<string>('database.password');
				const database = configService.get<string>('database.database');
				const connectionLimit = configService.get<number>('database.connectionLimit');

				logger.log(`📍 Configuración:`);
				logger.log(`   Host: ${host}`);
				logger.log(`   Port: ${port}`);
				logger.log(`   User: ${user}`);
				logger.log(`   Password: ${password ? '***' : '(vacío)'}`);
				logger.log(`   Database: ${database}`);

				const pool = mysql.createPool({
					host,
					port,
					user,
					password,
					database,
					waitForConnections: true,
					connectionLimit,
					queueLimit: 0,
					enableKeepAlive: true,
					keepAliveInitialDelay: 0,
				});

				logger.log(`📊 Pool configurado con límite de ${connectionLimit} conexiones`);

				try {
					const connection = await pool.getConnection();
					logger.log('✅ Pool de conexiones inicializado correctamente');
					logger.log(`📍 Conectado a: ${host}:${port}/${database}`);
					connection.release();
					logger.log('🔓 Conexión de prueba liberada al pool');
				} catch (error) {
					logger.error('❌ Error al inicializar pool de conexiones:', error);
					throw error;
				}

				return pool;
			},
			inject: [ConfigService],
		},
	],
	exports: ['DATABASE_POOL'],
})
export class DatabaseModule implements OnModuleDestroy {
	private readonly logger = new Logger(DatabaseModule.name);

	async onModuleDestroy() {
		this.logger.warn('⚠️  Aplicación cerrándose, limpiando pool de conexiones...');
	}
}
