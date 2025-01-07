import { arch } from 'os';
import { Archivo } from 'src/archivos/entities/archivo.entity';
import { DocumentoArchivo } from 'src/archivos/entities/documento_archivo.entity';
import { HistorialMovimientos } from 'src/hojas_ruta/entities/historial_movimientos.entity';
import { User } from 'src/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
export enum Tipo {
	NOTA_INTERNA = 'NOTA INTERNA',
	NOTA_EXTERNA = 'NOTA EXTERNA',
	INFORME = 'INFORME',
}
@Entity()
export class Documento {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	cite: string;

	@Column({ nullable: false, type: 'enum', enum: Tipo })
	tipo: Tipo;

	@ManyToOne(() => User, (user) => user.documento, { onUpdate: 'CASCADE' })
	emisor: User;

	@OneToMany(() => DocumentoArchivo, (archivo) => archivo.documento)
	archivo: DocumentoArchivo;

	@OneToMany(() => HistorialMovimientos, (historial) => historial.documento)
	historialMovimientos: HistorialMovimientos;

	@DeleteDateColumn()
	deletedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
