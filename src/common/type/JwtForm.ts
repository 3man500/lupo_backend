export class JwtForm{
    userId: number
    username: string

    constructor(userId: number, username: string){
        this.userId = userId
        this.username = username
    }
    setUserId(userId: number){
        this.userId = userId
    }

    setUsername(username: string){
        this.username = username
    }
}