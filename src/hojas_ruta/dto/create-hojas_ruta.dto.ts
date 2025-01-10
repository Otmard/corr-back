import { IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { Estado, Prioridad } from "../entities/hojas_ruta.entity";

export class CreateHojasRutaDto {
	@IsNotEmpty()
	@IsString()
	emisorId: string; // ID del emisor (User)

	@IsOptional() // Puede no ser obligatorio
	@IsString()
	responsableActualId: string; // ID del responsable actual (User)

	@IsEnum(Estado)
	estado: Estado;

	@IsString()
	@IsEnum(Prioridad)
	@IsOptional()
	prioridad: Prioridad;

	@IsString()
	@IsNotEmpty()
	referencia: string;
	
	@IsString()
	@IsNotEmpty()
	cite: string;
}
