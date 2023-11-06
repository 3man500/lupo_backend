import { User } from './user.entity';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Patch, Post, Query, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { userCreateDto } from './dto/userCreate.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';
import { Request, Response } from 'express';
import { UpdateLocationDto } from './dto/updateLocationDto';
import { LocationService } from './location/location.service';
import { LIMITED_DISTANCE } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly locationService: LocationService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) userCreateDto: userCreateDto): Promise<{}>{
        return this.authService.signUp(userCreateDto)
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) userCreateDto: userCreateDto, @Res() res: Response): Promise<any>{
        const jwt =  await this.authService.signIn(userCreateDto)
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        res.cookie('access_token',jwt.accessToken,{
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000 //1 day
        });

        return res.send({
            message: 'success',
            access_token: jwt.accessToken
        })
    }

    @Patch('/location')
    async updateLocation(@Req() req: Request, @Body() updateLocationDto: UpdateLocationDto){
        console.log("cookie", req.cookies.access_token)
        const authUser = await this.authService.decodeJwt(req)
        console.log(authUser, authUser.userId, updateLocationDto.lat, updateLocationDto.lon)
        return this.authService.updateLocation(updateLocationDto.lat, updateLocationDto.lon, authUser.userId)
    }

    @Get('/location/adjacency')
    async checkDistanceAdjacency(
        @Query('userId1') userId1: number, @Query('userId2') userId2: number
    ){
        const dist = await this.locationService.getDistanceByUserId(userId1, userId2)

        if(dist !== null && dist < LIMITED_DISTANCE){
            return true
        }else{
            return false
        }
    }

    @Get('/users/adjacency')
    async getAdjacencyUsers(
        @Req() req: Request
    ){
        console.log("cookie", req.cookies.access_token)
        const authUser = await this.authService.decodeJwt(req)

        return this.authService.getUsersAdjacency(authUser.userId)

    }

    @Post('/logout')
    logout(@Res() res: Response): any{
        res.cookie('access_token', 'none', {
            httpOnly: false,
            maxAge: 0
        })
        return res.send({
            message: 'success'
        })
    }

    @Post('/me')
    me(@Req() req: Request, @Res() res: Response){
        console.log("cookie", req.cookies.access_token)
        return this.authService.authCheck(req,res)
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log('user', user)
    }

    @Get('hello')
    hello(){
        return this.authService.getUsersAdjacency(1)
        //return 'hello'
    }
}
