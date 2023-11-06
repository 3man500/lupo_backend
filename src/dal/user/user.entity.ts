import { BaseEntity, Column, Entity, Long, OneToMany, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn, Unique, Double } from 'typeorm';



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
    gender: string

    @Column({nullable: true})
    realname: string

    @Column({nullable: true})
    nickname: string

    @Column()
    password: string

    @Column({nullable: true})
    phone: string

    @Column({nullable: true, type: 'float8'})
    lat: Double

    @Column({nullable: true, type: 'float8'})
    lon: Double
}