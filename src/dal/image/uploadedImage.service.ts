import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UploadedImageRepository } from "./uploadedImage.repository"

@Injectable()
export class UploadedImageService{
    constructor(
    @InjectRepository(UploadedImageRepository) 
        private readonly uploadedImageRepository: UploadedImageRepository
        ){}
    async uploadProfileImage(image: string, file_name: string, ip: string, order: number, user_id: number){

        console.log(image)
        const uploadedImage = this.uploadedImageRepository.create({image, file_name, ip, order, user_id})
        console.log('good', uploadedImage)
        this.uploadedImageRepository.save(uploadedImage)
        
    }
}3