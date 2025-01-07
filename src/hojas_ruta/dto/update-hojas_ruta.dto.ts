import { PartialType } from '@nestjs/mapped-types';
import { CreateHojasRutaDto } from './create-hojas_ruta.dto';

export class UpdateHojasRutaDto extends PartialType(CreateHojasRutaDto) {}
