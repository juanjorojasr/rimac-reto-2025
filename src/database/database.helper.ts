import { Injectable, Inject, Logger } from '@nestjs/common';
import type { Pool, RowDataPacket, PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseHelper {
  private readonly logger = new Logger(DatabaseHelper.name);

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async query<T extends RowDataPacket>(
    sql: string,
    params: any[] = [],
  ): Promise<T[]> {
    const startTime = Date.now();
    let connection: PoolConnection | null = null;

    try {
      this.logger.debug('🔵 Solicitando conexión del pool...');
      connection = await this.pool.getConnection();
      this.logger.debug('✅ Conexión obtenida del pool');

      this.logger.log('🔍 Ejecutando query:');
      this.logger.log(`   SQL: ${sql}`);
      this.logger.log(`   Params: ${JSON.stringify(params)}`);

      const [rows] = await connection.execute<T[]>(sql, params);

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Query ejecutado exitosamente en ${duration}ms`);
      this.logger.log(`📦 Resultados: ${rows.length} fila(s)`);
      this.logger.debug(`   Datos: ${JSON.stringify(rows).substring(0, 200)}${rows.length > 0 ? '...' : ''}`);

      return rows;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Error ejecutando query (${duration}ms)`);
      this.logger.error(`   SQL: ${sql}`);
      this.logger.error(`   Params: ${JSON.stringify(params)}`);
      this.logger.error(`   Error: ${error}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
        this.logger.debug('🔓 Conexión liberada al pool');
      }
    }
  }

  async queryOne<T extends RowDataPacket>(
    sql: string,
    params: any[] = [],
  ): Promise<T | null> {
    this.logger.debug('🔍 Ejecutando queryOne (espera un único resultado)...');
    const rows = await this.query<T>(sql, params);
    const result = rows.length > 0 ? rows[0] : null;
    this.logger.log(`📌 QueryOne resultado: ${result ? 'Encontrado' : 'No encontrado'}`);
    return result;
  }

  buildWhereClause(conditions: Record<string, any>): {
    where: string;
    params: any[];
  } {
    const clauses: string[] = [];
    const params: any[] = [];

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        clauses.push(`${key} = ?`);
        params.push(value);
      }
    });

    return {
      where: clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '',
      params,
    };
  }
}
