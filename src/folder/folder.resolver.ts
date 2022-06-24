import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateFolderInput,
  FolderListInput,
  FoldersWithNoteCountResult,
  PaginatedFoldersResult,
  UpdateFolderInput,
} from '../folder/folder.input';
import { FolderService } from './folder.service';
import { Folder } from './folder.schema';
import { NoteService } from '../note/services/note.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/users/users.schema';
import { PaginationService } from 'src/utils/pagination/service/pagination.service';
import mongoose from 'mongoose';
import { IResponsePaging } from 'src/utils/response/response.interface';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(
    private folderService: FolderService,
    private noteService: NoteService,
    private readonly paginationService: PaginationService
  ) {}

  @Query(() => [Folder])
  async getFolders() {
    return this.folderService.findAll();
  }

  @Query(() => Folder)
  async getFolderById(@Args('id') id: string) {
    return this.folderService.getById(id);
  }

  @Mutation(() => Folder)
  async deleteFolder(@Args('id') id: string) {
    const notes = await this.noteService.getByFolderId(id);
    const noteIds: any[] = notes.map((note) => note.id);

    // delete each notes inside the folder
    await this.noteService.moveManyToRecycleBinAndDeleteFolder(noteIds);
    return await this.folderService.delete(id);
  }

  @Mutation(() => Boolean)
  async deleteAllFolders() {
    return this.folderService.deleteAll();
  }

  @Query(() => [FoldersWithNoteCountResult])
  async getFoldersWithNotesCount() {
    return this.folderService.findFoldersWithNotesCount();
  }

  // -------------------------------------------- //
  // ------------------- USER ------------------- //
  // -------------------------------------------- //
  @Mutation(() => Folder)
  @UseGuards(JwtAuthGuard)
  async createFolder(
    @CurrentUser() user: User,
    @Args('values') values: CreateFolderInput
  ) {
    return this.folderService.create(values, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Folder)
  async getUserFolderById(@Args('id') id: string, @CurrentUser() user: User) {
    return this.folderService.getByIdAndUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedFoldersResult)
  async getUserFoldersWithNotesCount(
    @CurrentUser() user: User,
    @Args('options') options: FolderListInput
  ): Promise<IResponsePaging> {
    const { page, perPage, sort, search, availableSort, availableSearch } =
      options;

    const skip: number = await this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {
      $expr: {
        $and: [
          { $eq: ['$user', new mongoose.Types.ObjectId(user.id.toString())] }, // only for the user
        ],
      },
    };

    if (search) {
      find['$expr']['$and'].push({
        $regexMatch: {
          input: '$name', // field to search
          regex: search, // text to search
          options: 'i', // non case sensitive
        },
      });
    }

    const folders: FoldersWithNoteCountResult[] =
      await this.folderService.findUserFoldersWithNotesCount(find, {
        limit: perPage,
        skip,
        sort,
      });
    const totalData: number =
      await this.folderService.getUserFoldersWithNotesCountTotal(find);
    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage
    );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: folders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Folder])
  async getUserFolders(@CurrentUser() user: User) {
    return this.folderService.findAllByUser(user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Folder)
  async updateUserFolder(
    @Args('id') id: string,
    @CurrentUser() user: User,
    @Args('values') values: UpdateFolderInput
  ) {
    return this.folderService.updateByUser(id, user.id.toString(), values);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Folder)
  async deleteUserFolder(@Args('id') id: string, @CurrentUser() user: User) {
    return this.folderService.deleteByUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteManyUserFoldersByUser(
    @Args({
      name: 'ids',
      type: () => [String],
    })
    ids: string[],
    @CurrentUser() user: User
  ) {
    return this.folderService.deleteManyByUser(ids, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteAllFoldersByUser(@CurrentUser() user: User) {
    return this.folderService.deleteAllByUser(user.id.toString());
  }
}
