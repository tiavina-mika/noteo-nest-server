import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateNoteInput,
  RecycleBinNotesInput,
  UpdateNoteInput,
} from './note.input';
import { NoteService } from '../note/note.service';
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

  @Query((returns) => [Note])
  async getNotes() {
    return this.noteService.findAll();
  }

  @Query((returns) => Note)
  async getNoteById(@Args('id') id: string) {
    return this.noteService.getById(id);
  }

  @Query((returns) => [Note])
  async getNotesByFolderId(@Args('folderId') folderId: string) {
    return this.noteService.getByFolderId(folderId);
  }

  @Query((returns) => [Note])
  async getNotesWithoutFolder() {
    return this.noteService.getNotesWithoutFolder();
  }

  @Query((returns) => [Note])
  async getNotesFromRecycleBin() {
    return this.noteService.getNotesFromRecycleBin();
  }

  @Mutation((returns) => Note)
  async updateNote(
    @Args('id') id: string,
    @Args('values') values: UpdateNoteInput
  ) {
    return this.noteService.update(id, values);
  }

  @Mutation((returns) => Note)
  async deleteNote(@Args('id') id: string) {
    return this.noteService.delete(id);
  }

  @Mutation((returns) => Boolean)
  async moveNotesToRecycleBin(@Args('values') values: RecycleBinNotesInput) {
    return this.noteService.moveManyToRecycleBin(values);
  }

  @Mutation((returns) => Boolean)
  async deleteNotesFromRecycleBin() {
    return this.noteService.deleteAllFromRecycleBin();
  }

  @Mutation((returns) => Note)
  async moveNoteToRecycleBin(
    @Args('id') id: string,
    @Args('value') value: boolean
  ) {
    return this.noteService.moveToRecycleBin(id, value);
  }

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
}
