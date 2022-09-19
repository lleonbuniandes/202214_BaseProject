import { Type } from 'class-transformer';
import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class CiudadDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
 
    @IsString()
    @IsNotEmpty()
    readonly pais: string;
 
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    readonly habitantes: number;
}
