import { User } from '../user.entity';
import { Double } from 'typeorm';
export class UserDto {
    id: number
    nickname: string
    realname: string
    phone: string
    username: string
    age: number
    gender: string
    lat: Double
    lon: Double

    public static of(user: User){
        const res = new UserDto()
        res.id = user.id
        res.username = user.username
        res.age = user.age
        res.gender = user.gender
        res.realname = user.realname
        res.nickname = user.nickname
        res.phone = user.phone
        res.lat = user.lat
        res.lon = user.lon

        return res
    }
}