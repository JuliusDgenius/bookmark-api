import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	signup() {
		return { message: "You are signed up!" }
	}

	signin() {
		return { message: "You are signed in!" }
	}
}