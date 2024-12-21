import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto';
import { Request } from "express";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}


	@Post('Signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	 @HttpCode(HttpStatus.OK)
	@Post('Signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}
}