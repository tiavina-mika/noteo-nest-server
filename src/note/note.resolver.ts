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
  async getById(@Args('id') id: string) {
    return this.noteService.getById(id);
  }

  @Mutation((returns) => Note)
  async updateNote(@Args('values') values: UpdateNoteInput) {
    return this.noteService.update(values);
  }

  @Mutation((returns) => Note)
  async deleteNote(@Args('id') id: string) {
    return this.noteService.delete(id);
  }
}
