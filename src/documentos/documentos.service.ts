import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Documento } from './entities/documento.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import {
	DocumentoArchivo,
	Tipo,
} from 'src/archivos/entities/documento_archivo.entity';
import { Archivo } from 'src/archivos/entities/archivo.entity';

@Injectable()
export class DocumentosService {
	constructor(
		@InjectRepository(Documento)
		private readonly documentosRepository: Repository<Documento>,

		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,

		@InjectRepository(DocumentoArchivo)
		private readonly documentoArchivoRepository: Repository<DocumentoArchivo>,

		@InjectRepository(Archivo)
		private readonly archivosRepository: Repository<Archivo>,
	) {}

	async create(createDocumentoDto: CreateDocumentoDto): Promise<Documento> {
		const user = await this.usersRepository.findOne({
			where: { uuid: createDocumentoDto.userId },
		});

		if (!user) {
			throw new NotFoundException(
				`User with ID ${createDocumentoDto.userId} not found`,
			);
		}
		const cite = await this.documentosRepository.findOneBy({
			cite: createDocumentoDto.cite,
		});

		if (cite) {
			throw new BadRequestException('El cite ya esta en uso');
		}

		const documento = await this.documentosRepository.create({
			...createDocumentoDto,
			emisor: user,
		});

		const archivo = await this.archivosRepository.findOneBy({
			id: createDocumentoDto.archivoPrincipal,
		});
		await this.documentosRepository.save(documento);
		if (archivo) {
			const ar = await this.documentoArchivoRepository.save({
				documento: documento,
				archivo: archivo,
				tipo: Tipo.Principal,
			});
		} else {
			await this.documentosRepository.delete(documento);
			throw new BadRequestException('Archivo principal no encontrado');
		}

		if (createDocumentoDto.adjuntos.length > 0) {
			const adjuntos = await this.archivosRepository.findBy({
				id: In(createDocumentoDto.adjuntos),
			});

			if (adjuntos.length === 0) {
				await this.documentosRepository.delete(documento);
				throw new BadRequestException('Archivo adjunto no encontrado');
			} else {
				for (const adjunto of adjuntos) {
					this.documentoArchivoRepository.save({
						documento: documento,
						archivo: adjunto,
						tipo: Tipo.Secundario,
					});
				}
			}
		}

		return await this.documentosRepository.save(documento);
	}

	async generateCite(userId: string): Promise<{
		user: User;
		cite: string;
		uuid: string;
		destinatarios: User[];
	}> {
		const currentYear = new Date().getFullYear();

		// Función para obtener las iniciales de un texto
		const getInitials = (text: string): string =>
			text
				.trim()
				.split(/\s+/)
				.map((word) => word[0].toUpperCase())
				.join('');

		// Obtener el usuario con los datos necesarios
		const user = await this.usersRepository.findOne({
			where: { uuid: userId },
			select: ['fullName', 'cargo', 'uuid'], // Selecciona solo los campos necesarios
		});

		if (!user) {
			throw new HttpException(
				`User with ID ${userId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}

		// Obtener el siguiente ID global
		const getNextDocumentoId = async (): Promise<string> => {
			const lastDocument = await this.documentosRepository.findOne({
				where: {},
				order: { id: 'DESC' },
			});
			return lastDocument
				? (lastDocument.id + 1).toString().padStart(5, '0')
				: '000001';
		};

		// Obtener el siguiente ID específico para el usuario
		const getNextDocumentoIdForUser = async (
			userId: string,
		): Promise<string> => {
			const documentCount = await this.documentosRepository.count({
				where: { emisor: { uuid: userId } },
			});
			return (documentCount + 1).toString().padStart(5, '0');
		};

		// Generar el cite utilizando las funciones auxiliares
		const globalId = await getNextDocumentoId();
		const userSpecificId = await getNextDocumentoIdForUser(userId);
		const userInitials = getInitials(user.fullName);
		const cargoInitials = getInitials(user.cargo);

		const res = `FESUD/${currentYear}-${globalId}|${userInitials}-${cargoInitials} N°${userSpecificId}/${currentYear}`;

		const users: User[] = await this.usersRepository.find({
			where: { uuid: Not(userId) },
			select: ['fullName', 'cargo', 'uuid'],
		});
		return { user: user, cite: res, uuid: userId, destinatarios: users };
	}

	async findAll(): Promise<Documento[]> {
		return this.documentosRepository.find({
			relations: ['user'], // Carga la relación con el usuario
		});
	}

	async findOne(id: number): Promise<Documento> {
		const documento = await this.documentosRepository.findOne({
			where: { id },
			relations: ['user'],
		});

		if (!documento) {
			throw new NotFoundException(`Documento with ID ${id} not found`);
		}

		return documento;
	}

	async update(
		id: number,
		updateDocumentoDto: UpdateDocumentoDto,
	): Promise<Documento> {
		const documento = await this.documentosRepository.preload({
			id,
			...updateDocumentoDto,
		});

		if (!documento) {
			throw new NotFoundException(`Documento with ID ${id} not found`);
		}

		return this.documentosRepository.save(documento);
	}

	async remove(id: number): Promise<void> {
		const result = await this.documentosRepository.softDelete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Documento with ID ${id} not found`);
		}
	}

	async restore(id: number): Promise<void> {
		const result = await this.documentosRepository.restore(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Documento with ID ${id} not found`);
		}
	}
}
