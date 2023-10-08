import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDistince } from 'src/utils/location';
import { UserRepository } from '../user.repository';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ){}

    async getDistanceByUserId(userId1: number, userId2: number){
        const user1 = await this.userRepository.findOne(userId1)
        const user2 = await this.userRepository.findOne(userId2)

        return getDistince(Number(user1.lon), Number(user1.lat), Number(user2.lon), Number(user2.lat), true)
    }
}
