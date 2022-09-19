import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    
        @InjectRepository(SupermercadoEntity)
        private readonly SuperRepository: Repository<SupermercadoEntity>
    ) {}

    async addSupermarketToCity(ciudadId: string, superId: string): Promise<CiudadEntity> {
        const superM: SupermercadoEntity = await this.SuperRepository.findOne({where: {id: superId}});
        if (!superM)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND);
      
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]})
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND);
    
        ciudad.supermercados = [...ciudad.supermercados, superM];
        return await this.ciudadRepository.save(ciudad);
    }

    async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND)
       
        return ciudad.supermercados;
    }

    async findSupermarketFromCity(ciudadId: string, superId: string): Promise<SupermercadoEntity> {
        const superM: SupermercadoEntity = await this.SuperRepository.findOne({where: {id: superId}});
        if (!superM)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND)
       
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND)
   
        const ciudadSuper: SupermercadoEntity = ciudad.supermercados.find(e => e.id === superM.id);
   
        if (!ciudadSuper)
          throw new BusinessLogicException("El Supermercado con Id no esta asociado a la ciudad", BusinessError.PRECONDITION_FAILED)
   
        return ciudadSuper;
    }

    async updateSupermarketsFromCity(ciudadId: string, supers: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
    
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < supers.length; i++) {
          const superM: SupermercadoEntity = await this.SuperRepository.findOne({where: {id: supers[i].id}});
          if (!superM)
            throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND)
        }
    
        ciudad.supermercados = supers;
        return await this.ciudadRepository.save(ciudad);
    }

    async deleteSupermarketFromCity(ciudadId: string, superId: string){
        const superM: SupermercadoEntity = await this.SuperRepository.findOne({where: {id: superId}});
        if (!superM)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND)
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND)
    
        const museumArtwork: SupermercadoEntity = ciudad.supermercados.find(e => e.id === superM.id);
    
        if (!museumArtwork)
            throw new BusinessLogicException("El Supermercado con Id no esta asociado a la ciudad", BusinessError.PRECONDITION_FAILED)
 
        ciudad.supermercados = ciudad.supermercados.filter(e => e.id !== superId);
        await this.ciudadRepository.save(ciudad);
    } 
}
