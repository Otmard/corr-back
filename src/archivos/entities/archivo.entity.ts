import { Documento } from 'src/documentos/entities/documento.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { DocumentoArchivo } from './documento_archivo.entity';

@Entity()
export class Archivo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false , unique: true})
	key: string;

	@Column({ nullable: false })
	bucket: string;

	@Column({
		nullable: false,
	})
	tipo: string;

	@Column({ nullable: true })
	url: string;

	@OneToMany(
		() => DocumentoArchivo,
		(documentoArchivo) => documentoArchivo.archivo,
	)
	documento: DocumentoArchivo[];

	@DeleteDateColumn()
	deletedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
