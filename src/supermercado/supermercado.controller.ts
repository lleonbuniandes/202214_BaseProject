import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors  } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get(':marketId')
  async findOne(@Param('marketId') marketId: string) {
    return await this.supermercadoService.findOne(marketId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const ciudad: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
    return await this.supermercadoService.create(ciudad);
  }

  @Put(':marketId')
  async update(@Param('marketId') marketId: string, @Body() supermercadoDto: SupermercadoDto) {
    const ciudad: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
    return await this.supermercadoService.update(marketId, ciudad);
  }

  @Delete(':marketId')
  @HttpCode(204)
  async delete(@Param('marketId') marketId: string) {
    return await this.supermercadoService.delete(marketId);
  }
}
