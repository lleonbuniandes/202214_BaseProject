import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity'; 
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND);
   
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistenciaCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persistenciaCiudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.save({...persistenciaCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException("la ciudad con id no se encontró", BusinessError.NOT_FOUND);
     
        await this.ciudadRepository.remove(ciudad);
    }
}
