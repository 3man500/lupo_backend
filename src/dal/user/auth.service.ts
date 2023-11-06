import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userCreateDto } from './dto/userCreate.dto';
import { UserRepository } from './user.repository';
import * as bycrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { Any, Double, IsNull, Long, Not } from 'typeorm';
import { User } from './user.entity';
import { JwtForm } from 'src/common/type/JwtForm';
import { NotFoundError } from 'rxjs';
import { LocationService } from './location/location.service';
import { LIMITED_DISTANCE } from '../../utils/constants';
import { UserDto } from './dto/userDto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) 
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly locationService: LocationService
        ){}

        async getUsersAdjacency(userId: number){
            const users = await this.userRepository.find(
                {
                    where: [{"lat" : Not(IsNull()), "lon" : Not(IsNull()), "id": Not(userId)}]
                })

            //console.log(users)
            let adjacencyUsers = []
            await Promise.all(users.map(async (user: User) => {
                const dist = await this.locationService.getDistanceByUserId(userId, user.id)
                if(dist !== null && dist < LIMITED_DISTANCE){
                    const res = UserDto.of(user)
                    console.log(user.id, 1)
                    adjacencyUsers.push(res)
                }
                 
            }))

            console.log(adjacencyUsers)

            
        }

        async signUp(userCreateDto: userCreateDto): Promise<{}>{
            return this.userRepository.createUser(userCreateDto)
        }

        async signIn(userCreateDto: userCreateDto): Promise<{accessToken: string}>{
            const {username, password} = userCreateDto
            const user = await this.userRepository.findOne({username})

            if(user && (await bycrypt.compare(password, user.password))){
                //create token
                const payload = { username: username, userId: user.id }
                const accessToken = await this.jwtService.sign(payload)

                return {accessToken}
            } else{
                throw new UnauthorizedException('login failed.')
            }
        }

        async updateLocation(lat: Double, lon: Double, userId: number): Promise<User>{
            const user = await this.userRepository.findOne(userId)

            user.lat = lat
            user.lon = lon

            await this.userRepository.save(user)

            return user
        }

        async authCheck(req, res){
            const token = req.cookies.access_token
            if(token === undefined){
                return res.json({ isLogined : false })
            }
            console.log(token)
            const decodedToken = this.jwtService.decode(token)
            console.log(decodedToken)
            console.log(decodedToken['userId'])
            const id = decodedToken['userId']
            const username = decodedToken['username']
            console.log(id, username)
            
            const user = await this.userRepository.findOne({id})
            if(user.username === username){
                res.json({ isLogined : true,
                            userId : user.id,
                            username : user.username,
                            access_token : token
                        })
            }else{
                res.json({ isLogined : false})
            }
        }

        async decodeJwt(req): Promise<JwtForm>{
            const token = req.cookies.access_token
            if(token === undefined){
                throw new NotFoundException('not found access_token')
            }
            console.log(token)
            const decodedToken = this.jwtService.decode(token)
            console.log(decodedToken)
            console.log(decodedToken['userId'])
            const id = decodedToken['userId']
            const username = decodedToken['username']
            console.log(id, username)
            
            const user = await this.userRepository.findOne({id})
            const jwtForm = new JwtForm(user.id, user.username)
            if(user.username === username){
                return jwtForm
            }else{
               throw new BadRequestException('token is not available.')
            }
        }
}
