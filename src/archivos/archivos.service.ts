import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { Repository } from 'typeorm';
import { DocumentoArchivo } from './entities/documento_archivo.entity';

@Injectable()
export class ArchivosService {
	constructor(
		@InjectRepository(Archivo)
		private readonly archivoRepository: Repository<Archivo>,
		@InjectRepository(DocumentoArchivo)
		private readonly documentoArchivoRepository: Repository<DocumentoArchivo>,
	) {}
	async create(createArchivoDto: CreateArchivoDto): Promise<Archivo> {
		try {
			// Verificar si la key ya existe
			const existingArchivo = await this.archivoRepository.findOne({
				where: { key: createArchivoDto.key },
			});

			if (existingArchivo) {
				// Lanza un error de conflicto si la key está repetida
				throw new ConflictException(
					`La key '${createArchivoDto.key}' ya está en uso.`,
				);
			}

			// Crear y guardar el archivo
			const archivo = this.archivoRepository.create(createArchivoDto);
			return await this.archivoRepository.save(archivo);
		} catch (error) {
			// Si hay otro error, lanza un error interno con un mensaje más descriptivo
			if (error instanceof ConflictException) {
				throw error; // Ya lanzamos una excepción específica de conflicto
			}
			throw new InternalServerErrorException(
				'Error inesperado al procesar la solicitud.',
			);
		}
	}

	async findAll() {
		const archivos = await this.archivoRepository.find();
		return archivos;
	}

	async findOneByKey(key: string) {
		const archivo = await this.archivoRepository.findOne({
			where: { key },
		});
		return archivo;
	}

	update(id: number, updateArchivoDto: UpdateArchivoDto) {
		return `This action updates a #${id} archivo`;
	}

	remove(id: number) {
		return `This action removes a #${id} archivo`;
	}
}
