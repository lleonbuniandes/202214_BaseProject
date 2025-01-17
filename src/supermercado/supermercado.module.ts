import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoController } from './supermercado.controller';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  providers: [SupermercadoService],
  controllers: [SupermercadoController]
})
export class SupermercadoModule {}
