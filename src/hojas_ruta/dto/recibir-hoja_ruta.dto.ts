import { IsNumber, IsString } from 'class-validator';

export class RecibirHojaRutaDto {
	@IsNumber()
	id: number;

	@IsString()
	receptor: string;
}
