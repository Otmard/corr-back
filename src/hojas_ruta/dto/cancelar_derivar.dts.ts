import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CancelarDerivarDto {
	@IsNumber()
	@IsNotEmpty()
	idHistorial: number;
}