import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supersList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();
 
    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supersList = [];
    for(let i = 0; i < 5; i++){
        const superM: SupermercadoEntity = await repository.save({
        nombre: faker.company.name(), 
        longitud: faker.address.longitude(), 
        latitud: faker.address.latitude(),
        paginaWeb:faker.internet.url()})
        supersList.push(superM);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermercados', async () => {
    const supers: SupermercadoEntity[] = await service.findAll();
    expect(supers).not.toBeNull();
    expect(supers).toHaveLength(supersList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const superGuardado: SupermercadoEntity = supersList[0];
    const superM: SupermercadoEntity = await service.findOne(superGuardado.id);
    expect(superM).not.toBeNull();
    expect(superM.nombre).toEqual(superGuardado.nombre)
    expect(superM.latitud).toEqual(superGuardado.latitud)
    expect(superM.longitud).toEqual(superGuardado.longitud)
    expect(superM.paginaWeb).toEqual(superGuardado.paginaWeb)
  });

  it('findOne should throw an exception for an invalid superM', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "el supermercado con id no se encontró")
  });

  it('create should return a new superM', async () => {
    const superM: SupermercadoEntity = {
      id: "",
      nombre: faker.company.name(), 
      longitud: faker.address.longitude(), 
      latitud: faker.address.latitude(),
      paginaWeb:faker.internet.url(),
      ciudades: []
    }
 
    const nuevasuperM: SupermercadoEntity = await service.create(superM);
    expect(nuevasuperM).not.toBeNull();
 
    const superGuardado: SupermercadoEntity = await repository.findOne({where: {id: nuevasuperM.id}})
    expect(superGuardado).not.toBeNull();
    expect(superGuardado.nombre).toEqual(nuevasuperM.nombre)
    expect(superGuardado.latitud).toEqual(nuevasuperM.latitud)
    expect(superGuardado.longitud).toEqual(nuevasuperM.longitud)
    expect(superGuardado.paginaWeb).toEqual(nuevasuperM.paginaWeb)
  });

  it('update should modify a superM', async () => {
    const superM: SupermercadoEntity = supersList[0];
    superM.nombre = "New name";
    superM.paginaWeb = "New Web";
    const actualizarsuperM: SupermercadoEntity = await service.update(superM.id, superM);
    expect(actualizarsuperM).not.toBeNull();
    const superGuardado: SupermercadoEntity = await repository.findOne({ where: { id: superM.id } })
    expect(superGuardado).not.toBeNull();
    expect(superGuardado.nombre).toEqual(superM.nombre)
    expect(superGuardado.paginaWeb).toEqual(superM.paginaWeb)
  });

  it('update should throw an exception for an invalid superM', async () => {
    let superM: SupermercadoEntity = supersList[0];
    superM = {
      ...superM, nombre: "New name", paginaWeb: "New web"
    }
    await expect(() => service.update("0", superM)).rejects.toHaveProperty("message", "el supermercado con id no se encontró")
  });

  it('delete should remove a superM', async () => {
    const superM: SupermercadoEntity = supersList[0];
    await service.delete(superM.id);
     const superMEliminada: SupermercadoEntity = await repository.findOne({ where: { id: superM.id } })
    expect(superMEliminada).toBeNull();
  });

  it('delete should throw an exception for an invalid superM', async () => {
    const superM: SupermercadoEntity = supersList[0];
    await service.delete(superM.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "el supermercado con id no se encontró")
  });
});
