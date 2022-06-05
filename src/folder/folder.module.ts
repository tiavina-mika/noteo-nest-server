import { NoteModule } from './../note/note.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderResolver } from './folder.resolver';
import { Folder, FolderSchema } from './folder.schema';
import { FolderService } from './folder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    NoteModule,
  ],
  providers: [FolderService, FolderResolver],
  exports: [FolderService],
})
export class FolderModule {}
