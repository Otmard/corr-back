import { Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { DocumentoArchivo } from './entities/documento_archivo.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Archivo, DocumentoArchivo])],
	controllers: [ArchivosController],
	providers: [ArchivosService],
})
export class ArchivosModule {}
