import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('auth')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Post('signup')
    async signup(@Body() body: {email: string, fullName: string, password: string, role: 'Regular User'|'Admin'}){
        return this.userService.createUser(body.email, body.fullName, body.password, body.role);
    }

    @Post('signin')
    async signin(@Body() body: {email: string, password: string}){
        const user = await this.userService.validate(body.email,body.password);
        if(!user) throw new UnauthorizedException('Invalid Credentials');

        const token = await this.userService.login(user)
        return {access_token: token};
    }
}