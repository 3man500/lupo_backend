import { BaseEntity, Column, Entity, Long, OneToMany, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn, Unique } from 'typeorm';



@Entity('user')
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    username: string

    @Column({nullable: true})
    age: number

    @Column({nullable: true})
    gender: String

    @Column({nullable: true})
    realname: string

    @Column({nullable: true})
    nickname: string

    @Column()
    password: string

    @Column({nullable: true})
    phone: string

    @Column({nullable: true, type: 'float'})
    lat: string

    @Column({nullable: true, type: 'float'})
    lon: string
}