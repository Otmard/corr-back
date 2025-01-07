import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { log } from 'console';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private usersRepository: Repository<User>,
	) {}
	async create(createUserDto: CreateUserDto) {
		try {
			// 1. Verificar si el usuario ya existe en la base de datos
			const userInDb = await this.usersRepository.findOne({
				where: { email: createUserDto.email },
			});

			// 2. Verificar si el usuario ya existe en Firebase
			let userInFirebase: admin.auth.UserRecord | null = null;
			try {
				userInFirebase = await admin.auth().getUserByEmail(createUserDto.email);
			} catch (firebaseError) {
				// Si Firebase arroja un error porque el usuario no existe, continuar
				if (firebaseError.code !== 'auth/user-not-found') {
					throw new HttpException(
						`Firebase error: ${firebaseError.message}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}
			}

			// 3. Lanzar error si el usuario ya existe en ambos sistemas
			if (userInDb && userInFirebase) {
				throw new HttpException('User already exists', HttpStatus.CONFLICT);
			}

			// 4. Crear usuario en Firebase si no existe
			let newUserInFirebase: admin.auth.UserRecord | null = null;
			if (!userInFirebase) {
				newUserInFirebase = await admin.auth().createUser({
					email: createUserDto.email,
					password: createUserDto.password,
					displayName: createUserDto.fullName,
				});
			}

			// 5. Crear usuario en la base de datos si no existe
			if (!userInDb) {
				const userToSave = this.usersRepository.create({
					email: createUserDto.email,
					photoUrl: newUserInFirebase?.photoURL || null,
					fullName: newUserInFirebase?.displayName || null,
					uuid: newUserInFirebase?.uid || userInFirebase?.uid,
					cargo: createUserDto.cargo,
				});
				await this.usersRepository.save(userToSave);
			}

			// 6. Retornar el usuario creado o encontrado en Firebase
			return newUserInFirebase || userInFirebase;
		} catch (error) {
			// Manejo centralizado de errores
			if (error instanceof HttpException) {
				throw error; // Re-lanza excepciones controladas
			}

			throw new HttpException(
				`Error creating user: ${error.message}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findOneByEmail(email: string): Promise<admin.auth.UserRecord | null> {
		try {
			return await admin.auth().getUserByEmail(email);
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				return null; // Retorna null si el usuario no existe
			}
			throw new HttpException(
				'Error fetching user: ' + error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findAll() {
		return await this.usersRepository.find();
	}

	async findAllExcept(id: string) {
		return this.usersRepository.find({
			where: { uuid: Not(id) },
		});
	}

	async findOne(id: string) {
		const user = await this.usersRepository.findOne({ where: { uuid: id } });
		if (!user) {
			throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
		}
		return user;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	async remove(id: string) {
		// Reutiliza la validación y el retorno de findOne
		const user = await this.findOne(id);

		// Realiza el soft delete con el id del usuario encontrado
		await this.usersRepository.softDelete(id);
		try {
			await admin.auth().deleteUser(user.uuid);
		} catch (error) {
			return { message: 'Error deleting user', error };
		}
		return { message: 'User deleted', user };
	}
}
