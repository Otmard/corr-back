import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
} from 'class-validator';

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
}
