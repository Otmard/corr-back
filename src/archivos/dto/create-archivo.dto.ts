import {
	IsNotEmpty,
	IsString,
	IsEnum,
	IsOptional,
	IsUrl,
} from 'class-validator';
import { Documento } from 'src/documentos/entities/documento.entity';

export class CreateArchivoDto {
	@IsString()
	@IsNotEmpty()
	key: string;

	@IsString()
	@IsNotEmpty()
	bucket: string;

	@IsString()
	@IsNotEmpty()
	tipo: string;
}
