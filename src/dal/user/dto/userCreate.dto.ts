import { IsNumber, isPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class userCreateDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/,{
        message: 'password contain only english and number'
    })
    password: string

    @IsString()
    realname?: string

    @IsString()
    nickname?: string

    @IsString()
    gender?: string

    @IsNumber()
    age?: number

    @IsString() // @Todo isPhoneNumber region parameter 값 찾아서 바꾸자
    phone?: string
}