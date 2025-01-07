import { Module } from '@nestjs/common';
import { HojasRutaService } from './hojas_ruta.service';
import { HojasRutaController } from './hojas_ruta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HojasRuta } from './entities/hojas_ruta.entity';
import { HistorialMovimientos } from './entities/historial_movimientos.entity';
import { UsersModule } from 'src/users/users.module';
import { DocumentosModule } from 'src/documentos/documentos.module';

@Module({
	imports: [TypeOrmModule.forFeature([HojasRuta, HistorialMovimientos]),UsersModule,DocumentosModule],
	controllers: [HojasRutaController],
	providers: [HojasRutaService],
})
export class HojasRutaModule {}
