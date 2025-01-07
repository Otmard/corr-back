import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateHojasRutaDto } from './dto/create-hojas_ruta.dto';
import { UpdateHojasRutaDto } from './dto/update-hojas_ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HojasRuta, Estado } from './entities/hojas_ruta.entity';
import { HistorialMovimientos } from './entities/historial_movimientos.entity';
import { DerivarHojaRutaDto } from './dto/derivar_hoja_ruta.dto';
import { Documento } from 'src/documentos/entities/documento.entity';
import { RecibirHojaRutaDto } from './dto/recibir-hoja_ruta.dto';

@Injectable()
export class HojasRutaService {
	constructor(
		@InjectRepository(HojasRuta)
		private readonly hojasRutaRepository: Repository<HojasRuta>,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(HistorialMovimientos)
		private readonly historialMovimientosRepository: Repository<HistorialMovimientos>,
		@InjectRepository(Documento)
		private readonly documentosRepository: Repository<Documento>,
	) {}
	async create(createHojasRutaDto: CreateHojasRutaDto): Promise<HojasRuta> {
		const { emisorId, responsableActualId, estado, prioridad } =
			createHojasRutaDto;

		const emisor = await this.userRepository.findOne({
			where: { uuid: emisorId },
		});
		if (!emisor) {
			throw new NotFoundException(`Emisor con ID ${emisorId} no encontrado`);
		}
		const responsableActual = await this.userRepository.findOne({
			where: { uuid: responsableActualId },
		});
		if (!responsableActual) {
			throw new NotFoundException(
				`Emisor con ID ${responsableActual} no encontrado`,
			);
		}

		const hojaRuta = await this.hojasRutaRepository.create({
			emisor,
			responsableActual,
			estado,
			prioridad,
		});

		const nuevaHojaRuta = await this.hojasRutaRepository.save(hojaRuta);

		// const historial = await this.historialMovimientosRepository.create({
		// 	procedencia: emisor.uuid,
		// 	destino: responsableActual.uuid,
		// 	hojaRuta: hojaRuta.id,
		// });

		// await this.historialMovimientosRepository.save(historial);
		return nuevaHojaRuta;
	}
	async derivar(derivarHojasRutaDto: DerivarHojaRutaDto): Promise<HojasRuta> {
		const { idHojaRuta, idprocedencia, iddestino } = derivarHojasRutaDto;
		const hojaRuta = await this.hojasRutaRepository.findOne({
			where: { id: idHojaRuta },
			relations: ['responsableActual'],
		});

		if (!hojaRuta) {
			throw new NotFoundException(
				`HojaRuta con ID ${idHojaRuta} no encontrado`,
			);
		}
		if (hojaRuta.responsableActual.uuid !== idprocedencia) {
			throw new BadRequestException(
				`La hoja de ruta no se encuentra con el usuario `,
			);
		}

		const procedencia = await this.userRepository.findOne({
			where: { uuid: idprocedencia },
		});

		if (!procedencia) {
			throw new NotFoundException(
				`Procedencia con ID ${idprocedencia} no encontrado`,
			);
		}
		const destino = await this.userRepository.findOne({
			where: { uuid: iddestino },
		});

		if (!destino) {
			throw new NotFoundException(`Destino con ID ${iddestino} no encontrado`);
		}
		this.hojasRutaRepository.update(idHojaRuta, {
			estado: Estado.DERIVADA,
			responsableActual: destino,
		});
		const documento = await this.documentosRepository.findOne({
			where: { id: derivarHojasRutaDto.documento },
		});
		const historial = await this.historialMovimientosRepository.create({
			procedencia: procedencia,
			destino: destino,
			hojaRuta: idHojaRuta,
			instruccion: derivarHojasRutaDto.instruccion,
			documento: documento,
			accion: 'DERIVADA',
		});

		await this.historialMovimientosRepository.save(historial);

		return hojaRuta;
	}

	async recibir(recibirHojasRutaDto: RecibirHojaRutaDto) {
		const user = await this.userRepository.findOne({
			where: { uuid: recibirHojasRutaDto.receptor },
		});
		if (!user) {
			throw new NotFoundException(
				`Receptor con ID ${recibirHojasRutaDto.receptor} no encontrado`,
			);
		}
		const hojaRuta = await this.hojasRutaRepository.findOne({
			where: { id: recibirHojasRutaDto.id },
		});

		if (!hojaRuta) {
			throw new NotFoundException(
				`HojaRuta con ID ${recibirHojasRutaDto.id} no encontrado`,
			);
		}
		const ultimoMovimiento = await this.historialMovimientosRepository.findOne({
			where: { hojaRuta: recibirHojasRutaDto.id },
			order: { id: 'DESC' },
			relations: ['procedencia', 'destino', 'documento'],
		});

		// Crear un nuevo objeto a partir del último movimiento pero con cambios
		const nuevoMovimiento = this.historialMovimientosRepository.create({
			hojaRuta: recibirHojasRutaDto.id,
			destino: ultimoMovimiento.destino,
			procedencia: ultimoMovimiento.procedencia,
			instruccion: ultimoMovimiento.instruccion,
			documento: ultimoMovimiento.documento,
			accion: 'RECIBIDA', // Modifica solo la acción
		});

		// Guardar el nuevo registro en la base de datos
		await this.historialMovimientosRepository.save(nuevoMovimiento);

		const accion = await this.hojasRutaRepository.update(
			recibirHojasRutaDto.id,
			{
				responsableActual: user,
				estado: Estado.RECIBIDA,
			},
		);
		return accion;
	}
	async getBuzon(idUser: string) {
		const buzon = await this.hojasRutaRepository.find({
			where: { responsableActual: { uuid: idUser }, estado: Estado.DERIVADA },
			relations: [
				'historialMovimientos',
				'historialMovimientos.procedencia',
				'emisor',
			],
			order: {
				historialMovimientos: { createdAt: 'DESC' }, // Ordenar por la fecha de historialMovimientos en orden descendente
			},
		});
		return buzon;
	}
	async getPendientes(idUser: string) {
		// const pendientes = await this.hojasRutaRepository.find({
		// 	where: {
		// 		responsableActual: { uuid: idUser },
		// 		estado: Estado.RECIBIDA,
		// 		historialMovimientos: { accion: 'DERIVADA' },
		// 	},
		// 	relations: [
		// 		'historialMovimientos',
		// 		'historialMovimientos.procedencia',
		// 		'emisor',
		// 		'responsableActual',
		// 		'historialMovimientos.documento.archivo.archivo',
		// 	],
		// });
		// return pendientes;

		const pendientes = await this.hojasRutaRepository
			.createQueryBuilder('hojasRuta')
			.leftJoinAndSelect(
				'hojasRuta.historialMovimientos',
				'historialMovimientos',
			)
			.leftJoinAndSelect('historialMovimientos.procedencia', 'procedencia')
			.leftJoinAndSelect('hojasRuta.emisor', 'emisor')
			.leftJoinAndSelect('hojasRuta.responsableActual', 'responsableActual')
			.leftJoinAndSelect(
				'historialMovimientos.documento',
				'documento',
				'historialMovimientos.documento = documento.id',
			)
			.leftJoinAndSelect('documento.archivo', 'archivo')
			.leftJoinAndSelect('archivo.archivo', 'archivoData')
			.where('hojasRuta.responsableActual.uuid = :idUser', { idUser })
			.andWhere('hojasRuta.estado = :estado', { estado: Estado.RECIBIDA })
			.andWhere('historialMovimientos.accion = :accion', { accion: 'DERIVADA' })
			.orderBy('historialMovimientos.createdAt', 'DESC') // Ordena por fecha de creación
			.getMany();

		return pendientes;
	}
	async getStats(idUser: string) {
		const stats = await this.hojasRutaRepository
			.createQueryBuilder('hojaRuta')
			.select('hojaRuta.estado', 'estado')
			.addSelect('COUNT(hojaRuta.id)', 'cantidad')
			.where('hojaRuta.responsableActual = :responsableId', {
				responsableId: idUser,
			})
			.groupBy('hojaRuta.estado')
			.getRawMany();

		// Asegurar que todos los estados posibles están presentes
		const estados = Object.values(Estado); // Obtener todos los estados posibles
		const completeStats = estados.map((estado) => {
			const found = stats.find((row) => row.estado === estado);
			return {
				estado,
				cantidad: found ? Number(found.cantidad) : 0,
			};
		});

		return completeStats;
	}
	findAll() {
		return `This action returns all hojasRuta`;
	}

	findOne(id: number) {
		return `This action returns a #${id} hojasRuta`;
	}

	update(id: number, updateHojasRutaDto: UpdateHojasRutaDto) {
		return `This action updates a #${id} hojasRuta`;
	}

	remove(id: number) {
		return `This action removes a #${id} hojasRuta`;
	}
}
