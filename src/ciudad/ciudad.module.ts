import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService]
})
export class CiudadModule {}
