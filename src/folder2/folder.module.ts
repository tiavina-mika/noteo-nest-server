import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderResolver } from './folder.resolver';
import { FolderSchema } from '../folder/folder.schema';
import { FolderService } from './folder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Folder', schema: FolderSchema }]),
  ],
  providers: [FolderService, FolderResolver],
  exports: [FolderService, FolderResolver],
})
export class FolderModule {}
