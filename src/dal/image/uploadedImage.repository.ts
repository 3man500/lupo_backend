import { Repository, EntityRepository } from 'typeorm';
import { UploadedImage } from './uploadedImage.entity';
@EntityRepository(UploadedImage)
export class UploadedImageRepository extends Repository<UploadedImage>{
    
}