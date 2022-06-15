import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateNoteInput,
  RecycleBinNotesInput,
  UpdateNoteInput,
} from './note.input';
import { NoteService } from './services/note.service';
import { Note } from './note.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.schema';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';

@Resolver((of) => Note)
export class NoteResolver {
  constructor(private noteService: NoteService) {}

  @Mutation((returns) => Note)
  @UseGuards(JwtAuthGuard)
  async createNote(
    @CurrentUser() user: User,
    @Args('values') values: CreateNoteInput
  ) {
    return this.noteService.create(values, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Note])
  async getNotes() {
    return this.noteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => Note)
  async getNoteById(@Args('id') id: string) {
    return this.noteService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Note])
  async getNotesByFolderId(@Args('folderId') folderId: string) {
    return this.noteService.getByFolderId(folderId);
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Note])
  async getNotesWithoutFolder() {
    return this.noteService.getNotesWithoutFolder();
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Note])
  async getNotesFromRecycleBin() {
    return this.noteService.getNotesFromRecycleBin();
  }

  // @UseGuards(JwtAuthGuard)
  // @Mutation((returns) => Note)
  // async updateNote(
  //   @Args('id') id: string,
  //   @Args('values') values: UpdateNoteInput
  // ) {
  //   return this.noteService.update(id, values);
  // }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Note)
  async deleteNote(@Args('id') id: string) {
    return this.noteService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Boolean)
  async moveNotesToRecycleBin(@Args('values') values: RecycleBinNotesInput) {
    return this.noteService.moveManyToRecycleBin(values);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Boolean)
  async deleteNotesFromRecycleBin() {
    return this.noteService.deleteAllFromRecycleBin();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Note)
  async moveNoteToRecycleBin(
    @Args('id') id: string,
    @Args('value') value: boolean
  ) {
    return this.noteService.moveToRecycleBin(id, value);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Boolean)
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
  @UseGuards(JwtAuthGuard)
  @Query((returns) => Note)
  async getUserNoteById(@Args('id') id: string, @CurrentUser() user: User) {
    return this.noteService.getByIdAndUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Note)
  async updateUserNote(
    @Args('id') id: string,
    @CurrentUser() user: User,
    @Args('values') values: UpdateNoteInput
  ) {
    return this.noteService.updateByUser(id, user.id.toString(), values);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Note)
  async deleteUserNote(@Args('id') id: string, @CurrentUser() user: User) {
    return this.noteService.deleteByUser(id, user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Note)
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
  @Mutation((returns) => Boolean)
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
  @Mutation((returns) => Boolean)
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
  @Mutation((returns) => Boolean)
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
  @Mutation((returns) => Boolean)
  async deleteAllNotesByUser(@CurrentUser() user: User) {
    return this.noteService.deleteAllByUser(user.id.toString());
  }
}
