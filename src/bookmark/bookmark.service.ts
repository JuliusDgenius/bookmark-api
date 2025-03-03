import { ForbiddenException, HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class BookmarkService {
	constructor(private prisma: PrismaService) {}
	
	async createBookmark(userId: number, dto: CreateBookmarkDto) {
		const bookmark = await this.prisma.bookmark.create({
				data: {
					userId,
					...dto,
				},
		});

		return bookmark;
	}

	getBookmarks(userId: number) {
		return this.prisma.bookmark.findMany({
			where: {
				userId,
			},
		});
	}

	getBookmarkById(userId: number, bookmarkId: number) {
		return this.prisma.bookmark.findFirst({
			where: {
				id: bookmarkId,
				userId,
			},
		});
	}

	async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
		// get bookmark by id
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId
			}
		});

		// if bookman is owned by userId
		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('Access to resource denied.');
		}

		return await this.prisma.bookmark.update({
			where: {
				id: bookmarkId,
			},
			data: {
				...dto
			},
		});
	}
	
	async deleteBookmarkById(userId: number, bookmarkId: number) {
		// get bookmark by id
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId
			}
		});

		// if bookman is owned by userId
		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('Access to resource denied.');
		}
		
		await this.prisma.bookmark.delete({
			where: {
				id: bookmarkId,
			},
		});
	}
}

