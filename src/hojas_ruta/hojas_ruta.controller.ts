import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { HojasRutaService } from './hojas_ruta.service';
import { CreateHojasRutaDto } from './dto/create-hojas_ruta.dto';
import { UpdateHojasRutaDto } from './dto/update-hojas_ruta.dto';
import { DerivarHojaRutaDto } from './dto/derivar_hoja_ruta.dto';
import { RecibirHojaRutaDto } from './dto/recibir-hoja_ruta.dto';
import { ArchivarHojaRutaDto } from './dto/archivar_hoja_ruta.dto';
import { CancelarDerivarDto } from './dto/cancelar_derivar.dts';

@Controller('hojas-ruta')
export class HojasRutaController {
	constructor(private readonly hojasRutaService: HojasRutaService) {}
	@Post('archivar')
	archivar(@Body() archivarHojaRutaDto: ArchivarHojaRutaDto) {
		return this.hojasRutaService.archivar(archivarHojaRutaDto);
	}

	@Post('cancelar-derivar')
	cancelarDerivar(@Body() archivarHojaRutaDto: CancelarDerivarDto) {
		return this.hojasRutaService.cancelarDerivar(archivarHojaRutaDto);
	}
	@Post('derivar')
	derivar(@Body() derivarHojasRutaDto: DerivarHojaRutaDto) {
		return this.hojasRutaService.derivar(derivarHojasRutaDto);
	}
	@Post('recibir')
	recibir(@Body() recibirHojasRutaDto: RecibirHojaRutaDto) {
		return this.hojasRutaService.recibir(recibirHojasRutaDto);
	}
	@Post()
	create(@Body() createHojasRutaDto: CreateHojasRutaDto) {
		return this.hojasRutaService.create(createHojasRutaDto);
	}

	@Get('archivadas/:idUser')
	getArchivadas(@Param('idUser') idUser: string) {

		return this.hojasRutaService.getArchivadas(idUser);
	}

	@Get('buzon/:idUser')
	getBuzon(@Param('idUser') idUser: string) {
		return this.hojasRutaService.getBuzon(idUser);
	}
	@Get('derivadas/:idUser')
	getDerivadas(@Param('idUser') idUser: string) {
		return this.hojasRutaService.getDerivadas(idUser);
	}
	@Get('pendientes/:idUser')
	getPendientes(@Param('idUser') idUser: string) {
		return this.hojasRutaService.getPendientes(idUser);
	}

	@Get('stats/:idUser')
	getStats(@Param('idUser') idUser: string) {
		return this.hojasRutaService.getStats(idUser);
	}
	@Get()
	findAll() {
		return this.hojasRutaService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.hojasRutaService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateHojasRutaDto: UpdateHojasRutaDto,
	) {
		return this.hojasRutaService.update(+id, updateHojasRutaDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.hojasRutaService.remove(+id);
	}
}
