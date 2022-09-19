import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadController } from './ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService],
  controllers: [CiudadController]
})
export class CiudadModule {}
