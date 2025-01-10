import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
} from 'class-validator';
import { Tipo } from '../entities/documento.entity';

export class CreateDocumentoDto {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	cite: string;

	@IsInt()
	@IsNotEmpty()
	archivoPrincipal: number;

	@IsArray()
	@IsOptional()
	adjuntos: number[];

	@IsString()
	@IsNotEmpty()
	referencia: string;

	@IsEnum(Tipo)
	@IsNotEmpty()
	tipo: Tipo;
}
