import { Module } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './entities/documento.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentoArchivo } from 'src/archivos/entities/documento_archivo.entity';
import { Archivo } from 'src/archivos/entities/archivo.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Documento, DocumentoArchivo,Archivo]),
		UsersModule,
	],
	controllers: [DocumentosController],
	providers: [DocumentosService],
	exports: [TypeOrmModule],
})
export class DocumentosModule {}
