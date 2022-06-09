import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateNoteInput, UpdateNoteInput } from './note.input';
import { NoteService } from '../note/note.service';
import { Note } from './note.schema';

@Resolver((of) => Note)
export class NoteResolver {
  constructor(private noteService: NoteService) {}

  @Mutation((returns) => Note)
  async createNote(@Args('values') values: CreateNoteInput) {
    return this.noteService.create(values);
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

  @Mutation((returns) => Note)
  async moveToRecycleBin(
    @Args('id') id: string,
    @Args('value') value: boolean
  ) {
    return this.noteService.moveToRecycleBin(id, value);
  }
}
