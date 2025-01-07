import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DerivarHojaRutaDto {
	@IsNumber()
	@IsNotEmpty()
	idHojaRuta: number;

	@IsString()
	@IsNotEmpty()
	idprocedencia: string;

	@IsString()
	@IsNotEmpty()
	iddestino: string;

	@IsString()
	@IsNotEmpty()
	instruccion: string;

	@IsNumber()
	@IsNotEmpty()
	documento:number
}
