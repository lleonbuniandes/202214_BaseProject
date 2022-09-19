import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity'; 
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly ciudadRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.ciudadRepository.find({ relations: ["ciudades"] });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const ciudad: SupermercadoEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["ciudades"] } );
        if (!ciudad)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND);
   
        return ciudad;
    }

    async create(ciudad: SupermercadoEntity): Promise<SupermercadoEntity> {
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistenciaCiudad: SupermercadoEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persistenciaCiudad)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.save({...persistenciaCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: SupermercadoEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException("el supermercado con id no se encontró", BusinessError.NOT_FOUND);
     
        await this.ciudadRepository.remove(ciudad);
    }
}
