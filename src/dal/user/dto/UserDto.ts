import { User } from '../user.entity';
export class UserDto {
    id: number
    nickname: string
    realname: string
    phone: string
    username: string
    age: number
    gender: string

    public static of(user: User){
        const res = new UserDto()
        res.id = user.id
        res.username = user.username
        res.age = user.age
        res.gender = user.gender
        res.realname = user.realname
        res.nickname = user.nickname
        res.phone = user.phone

        return res
    }
}