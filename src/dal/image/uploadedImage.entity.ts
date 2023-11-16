import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';
@Entity('uploaded_image')
export class UploadedImage extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    image: string

    @Column({nullable: true})
    file_name: string

    @Column({nullable: true})
    ip: string

    @Column({nullable: true})
    order: number

    @DeleteDateColumn({type: "timestamp", nullable: true})
    deleted_at: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: string

    @Column()
    user_id: number
}