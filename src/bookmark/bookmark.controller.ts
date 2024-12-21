import {
	Body, Controller,
	Delete, Get,
	HttpCode,
	HttpStatus,
	Param, ParseIntPipe,
	Patch, Post,
	UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorators';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkerService: BookmarkService) {}

	@Post()
	createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
		return this.bookmarkerService.createBookmark(userId, dto);
	}

	@Get()
	getBookmarks(@GetUser('id') userId: number) {
		return this.bookmarkerService.getBookmarks(userId);
	}

	@Get(':id')
	getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
		return this.bookmarkerService.getBookmarkById(userId, bookmarkId);
	}

	@Patch(':id')
	editBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto) {
		return this.bookmarkerService.editBookmarkById(userId, bookmarkId, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
		return this.bookmarkerService.deleteBookmarkById(userId, bookmarkId);
	}
}
