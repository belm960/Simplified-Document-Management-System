import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}
    async createUser(email: string, fullName: string, password: string, role: 'Regular User'| 'Admin'): Promise<User>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new UnauthorizedException('Invalid Email Format')
        }
        if (role!=='Regular User' && role!=='Admin'){
            throw new UnauthorizedException('Invalid Role Specified')
        }

        const existingUser = await this.userRepository.findOne({where: {email}});
        if(existingUser){
            throw new UnauthorizedException('Email Already In Use')
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({email,fullName, password: hashPassword, role: role});

        return this.userRepository.save(user);
    }

    async validate(email: string, password: string): Promise<User>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)){
            throw new UnauthorizedException('Invalid Email Format')
        }
        const user = await this.userRepository.findOne({where: {email}})
        if(!user) return null

        const isValid = await bcrypt.compare(password, user.password);
        return isValid?user:null;
    }

    async login(user: User): Promise<string>{
        const payload = {email: user.email, sub: user.id, role: user.role}
        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
    }
}