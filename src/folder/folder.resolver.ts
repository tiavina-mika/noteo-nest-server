import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateFolderInput,
  FoldersWithNoteCount,
  UpdateFolderInput,
} from '../folder/folder.input';
import { FolderService } from './folder.service';
import { Folder } from './folder.schema';
import { NoteService } from '../note/services/note.service';

@Resolver((of) => Folder)
export class FolderResolver {
  constructor(
    private folderService: FolderService,
    private noteService: NoteService
  ) {}

  @Mutation((returns) => Folder)
  async createFolder(@Args('values') values: CreateFolderInput) {
    return this.folderService.create(values);
  }

  @Query((returns) => [Folder])
  async getFolders() {
    return this.folderService.findAll();
  }

  @Query((returns) => Folder)
  async getFolderById(@Args('id') id: string) {
    return this.folderService.getById(id);
  }

  @Mutation((returns) => Folder)
  async updateFolder(
    @Args('id') id: string,
    @Args('values') values: UpdateFolderInput
  ) {
    return this.folderService.update(id, values);
  }

  @Mutation((returns) => Folder)
  async deleteFolder(@Args('id') id: string) {
    const notes = await this.noteService.getByFolderId(id);
    const noteIds: any[] = notes.map((note) => note.id);

    // delete each notes inside the folder
    await this.noteService.moveManyToRecycleBinAndDeleteFolder(noteIds);
    return await this.folderService.delete(id);
  }

  @Mutation((returns) => Boolean)
  async deleteAllFolders() {
    return this.folderService.deleteAll();
  }

  @Query((returns) => [FoldersWithNoteCount])
  async getFoldersWithNotesCount() {
    return this.folderService.findFoldersWithNotesCount();
  }
}
