import { User } from 'src/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { HojasRuta } from './hojas_ruta.entity';
import { Documento } from 'src/documentos/entities/documento.entity';

@Entity()
export class HistorialMovimientos {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.procedencia, {
		onUpdate: 'CASCADE',
		nullable: false,
	})
	procedencia: User;

	@ManyToOne(() => User, (user) => user.destino, {
		onUpdate: 'CASCADE',
		nullable: false,
	})
	destino: User;

	@ManyToOne(() => HojasRuta, (hojaRuta) => hojaRuta.historialMovimientos, {
		onUpdate: 'CASCADE',
		nullable: false,
	})
	hojaRuta: number;

	@Column()
	accion: string;

	@ManyToOne(() => Documento, (documento) => documento.historialMovimientos)
	documento: Documento;

	@Column()
	instruccion: string;

	@DeleteDateColumn()
	deletedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
