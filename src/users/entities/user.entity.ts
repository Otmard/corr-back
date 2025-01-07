import { Documento } from 'src/documentos/entities/documento.entity';
import { HistorialMovimientos } from 'src/hojas_ruta/entities/historial_movimientos.entity';
import { HojasRuta } from 'src/hojas_ruta/entities/hojas_ruta.entity';
import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne,
	ManyToOne,
} from 'typeorm';
@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	uuid: string; // Identificador único

	@Column({ unique: true })
	email: string; // Correo electrónico (clave única)

	@Column({ nullable: true })
	photoUrl: string; // URL de la foto del usuario (nullable para proveedores OAuth)

	@Column()
	fullName: string; // Nombre para mostrar (nullable para proveedores OAuth)

	@Column({ default: 'normal' })
	rol: string;

	@Column({ nullable: false })
	cargo: string;

	@DeleteDateColumn()
	deletedAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Documento, (documento) => documento.emisor)
	documento: Documento[];

	@OneToMany(() => HojasRuta, (hojaRuta) => hojaRuta.emisor)
	hojaRuta: HojasRuta[];

	@OneToMany(() => HistorialMovimientos, (historial) => historial.destino)
	destino: HistorialMovimientos[];

	@OneToMany(() => HistorialMovimientos, (historial) => historial.procedencia)
	procedencia: HistorialMovimientos[];

	@OneToMany(() => HojasRuta, (hojaRuta) => hojaRuta.responsableActual)
	responsableActual: HojasRuta;
}
