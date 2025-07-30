import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });

    try {
      await this.client.connect();
      console.log('📦 Conectado a PostgreSQL');
    } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error.message);
      process.exit(1); // Opcional: salir si no se puede conectar
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.end();
      console.log('📦 Conexión cerrada con PostgreSQL');
    } catch (error) {
      console.error('❌ Error cerrando la conexión:', error.message);
    }
  }

  async query(text: string, params?: any[]) {
    try {
      const result = await this.client.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Error en la consulta SQL:', error.message);
      throw new Error('Error ejecutando la consulta SQL');
    }
  }
}
