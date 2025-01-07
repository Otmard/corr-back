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
import { HistorialMovimientos } from './historial_movimientos.entity';
export enum Prioridad {
	ALTA = 'Alta',
	NORMAL = 'Normal',
}
export enum Estado {
	EMITIDA = 'EMITIDA',
	RECIBIDA = 'RECIBIDA',
	DERIVADA = 'DERIVADA',
	ARCHIVADA = 'ARCHIVADA',
}
@Entity()
export class HojasRuta {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.hojaRuta, { onUpdate: 'CASCADE' })
	emisor: User;

	@ManyToOne(() => User, (user) => user.responsableActual, {
		onUpdate: 'CASCADE',
		nullable: true,
	})
	@JoinColumn() // Indica que esta tabla tendrá la FK
	responsableActual: User;

	@Column({ nullable: false, type: 'enum', enum: Estado })
	estado: Estado;

	@Column({
		nullable: false,
		type: 'enum',
		enum: Prioridad,
		default: Prioridad.NORMAL,
	})
	prioridad: Prioridad;

	@DeleteDateColumn()
	deletedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => HistorialMovimientos, (historial) => historial.hojaRuta)
	historialMovimientos: HistorialMovimientos;
}
