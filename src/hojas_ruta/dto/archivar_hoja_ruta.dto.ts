import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ArchivarHojaRutaDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	idUser: string;
}
