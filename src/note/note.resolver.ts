import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateNoteInput,
  NoteListInput,
  PaginatedNotesResult,
  RecycleBinNotesInput,
  UpdateNoteInput,
} from './note.input';
import { NoteService } from './services/note.service';
import { Note } from './note.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.schema';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { PaginationService } from 'src/utils/pagination/service/pagination.service';
import { IResponsePaging } from 'src/utils/response/response.interface';

@Resolver(() => Note)
export class NoteResolver {
  constructor(
    private noteService: NoteService,
    private readonly paginationService: PaginationService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Note])
  async getNotes() {
    return this.noteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Note)
  async getNoteById(@Args('id') id: string) {
    return this.noteService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Note])
  async getNotesByFolderId(@Args('folderId') folderId: string) {
    return this.noteService.getByFolderId(folderId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Note])
  async getNotesWithoutFolder() {
    return this.noteService.getNotesWithoutFolder();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Note])
  async getNotesFromRecycleBin() {
    return this.noteService.getNotesFromRecycleBin();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Note)
  async deleteNote(@Args('id') id: string) {
    return this.noteService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async moveNotesToRecycleBin(@Args('values') values: RecycleBinNotesInput) {
    return this.noteService.moveManyToRecycleBin(values);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteNotesFromRecycleBin() {
    return this.noteService.deleteAllFromRecycleBin();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Note)
  async moveNoteToRecycleBin(
    @Args('id') id: string,
    @Args('value') value: boolean
  ) {
    return this.noteService.moveToRecycleBin(id, value);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteManyFromRecycleBin(
    @Args({
      name: 'ids',
      type: () => [String],
    })
    ids: string[]
  ) {
    return this.noteService.deleteManyFromRecycleBin(ids);
  }

  // -------------------------------------------- //
  // ------------------- USER ------------------- //
  // -------------------------------------------- //
  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async createNote(
    @CurrentUser() user: User,
    @Args('values') values: CreateNoteInput
  ) {
    return this.noteService.create(values, user.id.toString());
  }

  // @UseGuards(JwtAuthGuard)
  // @Query(() => [Note])
  // async getNotesByUser(@CurrentUser() user: User) {
  //   const notes = await this.noteService.findAll({ user: user.id.toString() });
  //   return notes;
  // }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedNotesResult)
  async getNotesByUser(
    @CurrentUser() user: User,
    @Args('options') options: NoteListInput
  ): Promise<IResponsePaging> {
    const {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
      withFolder,
    } = options;
    const skip: number = await this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {
      user: user.id.toString(),
      deleted: { $ne: true },
    };

    if (typeof withFolder === 'boolean') {
      if (!withFolder) {
        find['$and'] = [
          ...(find['$and'] || []),
          {
            $or: [{ folder: { $eq: null } }, { folder: { $exists: false } }],
          },
        ];
      } else {
        find['$and'] = [
          ...(find['$and'] || []),
          {
            $or: [{ folder: { $ne: null } }, { folder: { $exists: true } }],
          },
        ];
      }
    }

    if (search) {
      find['$and'] = [
        ...(find['$and'] || []),
        {
          $or: [
            {
              title: {
                $regex: new RegExp(search),
                $options: 'i',
              },
            },
            {
              content: {
                $regex: new RegExp(search),
                $options: 'i',
              },
            },
          ],
        },
      ];
      // find['$or'] = [
      //   {
      //     title: {
      //       $regex: new RegExp(search),
      //       $options: 'i',
      //     },
      //   },
      //   {
      //     content: {
      //       $regex: new RegExp(search),
      //       $options: 'i',
      //     },
      //   },
      // ];
    }
    const notes: Note[] = await this.noteService.findAll(find, {
      limit: perPage,
      skip: skip,
      sort,
    });
    const totalData: number = await this.noteService.getTotal(find);
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
      data: notes,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Note)
  async getUserNoteById(@Args('id') id: string, @CurrentUser() user: User) {
    return this.noteService.getByIdAndUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Note)
  async updateUserNote(
    @Args('id') id: string,
    @CurrentUser() user: User,
    @Args('values') values: UpdateNoteInput
  ) {
    return this.noteService.updateByUser(id, user.id.toString(), values);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Note)
  async deleteUserNote(@Args('id') id: string, @CurrentUser() user: User) {
    return this.noteService.deleteByUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Note)
  async moveUserNoteToRecycleBin(
    @Args('id') id: string,
    @Args('value') value: boolean,
    @CurrentUser() user: User
  ) {
    return this.noteService.moveToRecycleBinByUser(
      id,
      value,
      user.id.toString()
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async moveManyUserNotesToRecycleBin(
    @Args({
      name: 'ids',
      type: () => [String],
    })
    ids: string[],
    @Args('value') value: boolean,
    @CurrentUser() user: User
  ) {
    return this.noteService.moveManyToRecycleBinAndDeleteFolderByUser(
      ids,
      value,
      user.id.toString()
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async moveAllUserNotesToRecycleBin(
    @Args('value') value: boolean,
    @CurrentUser() user: User
  ) {
    return this.noteService.moveAllToRecycleBinAndDeleteFolderByUser(
      value,
      user.id.toString()
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteManyUserNotesByUser(
    @Args({
      name: 'ids',
      type: () => [String],
    })
    ids: string[],
    @CurrentUser() user: User
  ) {
    return this.noteService.deleteManyByUser(ids, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteAllNotesByUser(@CurrentUser() user: User) {
    return this.noteService.deleteAllByUser(user.id.toString());
  }
}
