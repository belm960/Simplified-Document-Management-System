import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { JwtStrategy } from "./jwt.strategy";
import { UserService } from "src/user/user.service";
import { UserController } from "src/user/user.controller";

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'my-secret-key',
            signOptions: {expiresIn: '1h'},
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UserService,JwtStrategy],
    exports: [JwtModule],
    controllers: [UserController],
})
export class AuthModule {}