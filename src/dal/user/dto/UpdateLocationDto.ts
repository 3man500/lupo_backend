import { IsNotEmpty } from "class-validator"
import { Double, Long } from "typeorm"

export class UpdateLocationDto{
    lat: Double
    lon: Double
}