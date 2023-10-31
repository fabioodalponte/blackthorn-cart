import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from './carts/carts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ItemsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'bt.c5cdzamsz8y3.us-east-2.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'Fabio123',
      database: 'bt',
      autoLoadEntities: true,
      dropSchema: false,
      logging: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
