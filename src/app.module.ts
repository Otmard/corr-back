import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { DocumentosModule } from './documentos/documentos.module';
import { Documento } from './documentos/entities/documento.entity';
import { HojasRutaModule } from './hojas_ruta/hojas_ruta.module';
import { HojasRuta } from './hojas_ruta/entities/hojas_ruta.entity';
import { HistorialMovimientos } from './hojas_ruta/entities/historial_movimientos.entity';
import { ArchivosModule } from './archivos/archivos.module';
import { Archivo } from './archivos/entities/archivo.entity';
import { DocumentoArchivo } from './archivos/entities/documento_archivo.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: '',
			database: 'test',
			entities: [
				User,
				Documento,
				DocumentoArchivo,
				HojasRuta,
				HistorialMovimientos,
				Archivo,
			],
			synchronize: true,
		}),
		FirebaseAdminModule,
		UsersModule,
		DocumentosModule,
		HojasRutaModule,
		ArchivosModule,
	],
	controllers: [AppController, AuthController],
	providers: [AppService],
})
export class AppModule {}
