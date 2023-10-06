import { IsNotEmpty } from "class-validator"
import { Double, Long } from "typeorm"

export class UpdateLocationDto{
    @IsNotEmpty()
    userId: number
    lat: Double
    lon: Double
}