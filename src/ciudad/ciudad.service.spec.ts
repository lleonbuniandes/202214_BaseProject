import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();
 
    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
        nombre: faker.company.name(), 
        pais: faker.address.country(), 
        habitantes: faker.datatype.number()})
        ciudadList.push(ciudad);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a ciudad by id', async () => {
    const ciudadGuardada: CiudadEntity = ciudadList[0];
    const ciudad: CiudadEntity = await service.findOne(ciudadGuardada.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(ciudadGuardada.nombre)
    expect(ciudad.pais).toEqual(ciudadGuardada.pais)
    expect(ciudad.habitantes).toEqual(ciudadGuardada.habitantes)
  });

  it('findOne should throw an exception for an invalid ciudad', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "la ciudad con id no se encontró")
  });

  it('create should return a new ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.company.name(), 
      pais: faker.address.country(), 
      habitantes: faker.datatype.number(),
      supermercados: []
    }
 
    const nuevaCiudad: CiudadEntity = await service.create(ciudad);
    expect(nuevaCiudad).not.toBeNull();
 
    const ciudadGuardada: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}})
    expect(ciudadGuardada).not.toBeNull();
    expect(ciudadGuardada.nombre).toEqual(nuevaCiudad.nombre)
    expect(ciudadGuardada.pais).toEqual(nuevaCiudad.pais)
    expect(ciudadGuardada.habitantes).toEqual(nuevaCiudad.habitantes)
  });

  it('update should modify a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.nombre = "New name";
    ciudad.pais = "New country";
    const actualizarCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(actualizarCiudad).not.toBeNull();
    const ciudadGuardada: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadGuardada).not.toBeNull();
    expect(ciudadGuardada.nombre).toEqual(ciudad.nombre)
    expect(ciudadGuardada.pais).toEqual(ciudad.pais)
  });

  it('update should throw an exception for an invalid ciudad', async () => {
    let ciudad: CiudadEntity = ciudadList[0];
    ciudad = {
      ...ciudad, nombre: "New name", pais: "New country"
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "la ciudad con id no se encontró")
  });

  it('delete should remove a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
     const ciudadEliminada: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadEliminada).toBeNull();
  });

  it('delete should throw an exception for an invalid ciudad', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "la ciudad con id no se encontró")
  });
 
});
