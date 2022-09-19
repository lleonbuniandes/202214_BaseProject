import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

    @Post(':cityId/supermarkets/:marketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('marketId') marketId: string){
       return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, marketId);
   }

   @Get(':cityId/supermarkets/:marketId')
   async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('marketId') marketId: string){
       return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, marketId);
   }

   @Get(':cityId/supermarkets')
   async findSupermarketsFromCity(@Param('cityId') cityId: string){
       return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
   }

   @Put(':cityId/supermarkets')
   async updateSupermarketsFromCity(@Body() supermercadoDto: SupermercadoDto[], @Param('cityId') cityId: string){
       const supers = plainToInstance(SupermercadoEntity, supermercadoDto)
       return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supers);
   }

    @Delete(':cityId/supermarkets/:marketId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('cityId') cityId: string, @Param('marketId') marketId: string){
       return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, marketId);
   }
}
