import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteResolver } from './note.resolver';
import { Note, NoteSchema } from './note.schema';
import { NoteService } from './note.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  providers: [NoteService, NoteResolver],
})
export class NoteModule {}
