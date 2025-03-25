import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@src/config/dataSource';
import { ThrottlerProvider } from '@src/shared/providers/throttler/throttler.provider';
import { UserModule } from '@src/users/users.module';
import { AuthModule } from '@src/auth/auth.module';
import { JWTProvider } from '@src/shared/providers/jwt/jwt.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        dataSourceOptions(configService),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [ThrottlerProvider, JWTProvider],
})
export class AppModule {}
