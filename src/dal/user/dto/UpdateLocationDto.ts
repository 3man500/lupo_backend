import { IsNotEmpty } from "class-validator"
import { Long } from "typeorm"

export class UpdateLocationDto{
    @IsNotEmpty()
    userId: number
    lat: Long
    lon: Long
}