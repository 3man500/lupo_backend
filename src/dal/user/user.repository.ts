import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { userCreateDto } from './dto/userCreate.dto';
import { User } from './user.entity';
import * as bcrypt from "bcryptjs"

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async createUser(userCreateDto: userCreateDto): Promise<{}>{
        const {username, password, age, realname, nickname, gender, phone} = userCreateDto

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = this.create({username, password: hashedPassword, age, realname, nickname, gender, phone})

        try {
            await this.save(user)
            return {status: 200}
        } catch (error) {
            console.log(error)
            throw new ConflictException("username is already exist.")
        }
        
    }
}