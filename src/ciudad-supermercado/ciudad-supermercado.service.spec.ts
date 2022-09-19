import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let superRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadoList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    superRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    superRepository.clear();
    ciudadRepository.clear();
 
    supermercadoList = [];
    for(let i = 0; i < 5; i++){
      const superM: SupermercadoEntity = await superRepository.save({
        nombre: faker.company.name(), 
        longitud: faker.address.longitude(), 
        latitud: faker.address.latitude(),
        paginaWeb:faker.internet.url()})
        supermercadoList.push(superM);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.company.name(), 
      pais: faker.address.country(), 
      habitantes: faker.datatype.number(),
      supermercados: supermercadoList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add an supermercado to a ciudad', async () => {
    const superM: SupermercadoEntity = await superRepository.save({
      nombre: faker.company.name(), 
      longitud: faker.address.longitude(), 
      latitud: faker.address.latitude(),
      paginaWeb:faker.internet.url()
    });
 
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(), 
      pais: faker.address.country(), 
      habitantes: faker.datatype.number()
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(nuevaCiudad.id, superM.id);
   
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(superM.nombre)
    expect(result.supermercados[0].longitud).toBe(superM.longitud)
    expect(result.supermercados[0].latitud).toBe(superM.latitud)
    expect(result.supermercados[0].paginaWeb).toBe(superM.paginaWeb)
  });
  
  it('should thrown exception for an invalid supermercado', async () => {
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(), 
      pais: faker.address.country(), 
      habitantes: faker.datatype.number()
    })
 
    await expect(() => service.addSupermarketToCity(nuevaCiudad.id, "0")).rejects.toHaveProperty("message", "el supermercado con id no se encontró");
  });

  it('should throw an exception for an invalid ciudad', async () => {
    const superM: SupermercadoEntity = await superRepository.save({
      nombre: faker.company.name(), 
      longitud: faker.address.longitude(), 
      latitud: faker.address.latitude(),
      paginaWeb:faker.internet.url()
    });
 
    await expect(() => service.addSupermarketToCity("0", superM.id)).rejects.toHaveProperty("message", "la ciudad con id no se encontró");
  });

  it('findSupermarketFromCity should return un supermercado by ciudad', async () => {
    const superM: SupermercadoEntity = supermercadoList[0];
    const superGuardado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, superM.id, )
    expect(superGuardado).not.toBeNull();
    expect(superGuardado.nombre).toBe(superM.nombre);
    expect(superGuardado.latitud).toBe(superM.latitud);
    expect(superGuardado.longitud).toBe(superM.longitud);
    expect(superGuardado.paginaWeb).toBe(superM.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermercado', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "el supermercado con id no se encontró");
  });

  it('findSupermarketFromCity should throw an exception for an invalid ciudad', async () => {
    const superM: SupermercadoEntity = supermercadoList[0];
    await expect(()=> service.findSupermarketFromCity("0", superM.id)).rejects.toHaveProperty("message", "la ciudad con id no se encontró");
  });

  it('findSupermarketsFromCity should return supermercados by ciudad', async ()=>{
    const supers: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supers.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid ciudad', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "la ciudad con id no se encontró");
  });

  it('updateSupermarketsFromCity should update los supermercados for a ciudad', async () => {
    const nuevoSuper: SupermercadoEntity = await superRepository.save({
      nombre: faker.company.name(), 
      longitud: faker.address.longitude(), 
      latitud: faker.address.latitude(),
      paginaWeb:faker.internet.url()
    });
 
    const ciudadActualizada: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [nuevoSuper]);
    expect(ciudadActualizada.supermercados.length).toBe(1);
 
    expect(ciudadActualizada.supermercados[0].nombre).toBe(nuevoSuper.nombre);
    expect(ciudadActualizada.supermercados[0].latitud).toBe(nuevoSuper.latitud);
    expect(ciudadActualizada.supermercados[0].longitud).toBe(nuevoSuper.longitud);
    expect(ciudadActualizada.supermercados[0].paginaWeb).toBe(nuevoSuper.paginaWeb);
  });

  it('deleteSupermarketFromCity should remove an supermercado from a ciudad', async () => {
    const superM: SupermercadoEntity = supermercadoList[0];
   
    await service.deleteSupermarketFromCity(ciudad.id, superM.id);
 
    const ciudadAlmacenada: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const supereliminado: SupermercadoEntity = ciudadAlmacenada.supermercados.find(a => a.id === superM.id);
 
    expect(supereliminado).toBeUndefined();
 
  });


  it('deleteSupermarketFromCity should thrown an exception for an invalid supermercado', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "el supermercado con id no se encontró");
  });

});
