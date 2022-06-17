import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateFolderInput,
  FoldersWithNoteCount,
  UpdateFolderInput,
} from '../folder/folder.input';
import { FolderService } from './folder.service';
import { Folder } from './folder.schema';
import { NoteService } from '../note/services/note.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/users/users.schema';

@Resolver(() => Folder)
export class FolderResolver {
  constructor(
    private folderService: FolderService,
    private noteService: NoteService
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
  async updateFolder(
    @Args('id') id: string,
    @Args('values') values: UpdateFolderInput
  ) {
    return this.folderService.update(id, values);
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

  @Query(() => [FoldersWithNoteCount])
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
  @Query(() => [FoldersWithNoteCount])
  async getUserFoldersWithNotesCount(@CurrentUser() user: User) {
    return this.folderService.findUserFoldersWithNotesCount(user.id.toString());
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
