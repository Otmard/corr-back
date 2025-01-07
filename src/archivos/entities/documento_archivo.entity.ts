import { Documento } from 'src/documentos/entities/documento.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Archivo } from './archivo.entity';
export enum Tipo {
	Principal = 'Principal',
	Secundario = 'Secundario',
}
@Entity()
export class DocumentoArchivo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'enum', enum: Tipo })
	tipo: Tipo;

	@ManyToOne(() => Documento, (documento) => documento.archivo)
	documento: Documento;

	@ManyToOne(() => Archivo, (archivo) => archivo.documento)
	archivo: Archivo;
}
