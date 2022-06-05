import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateFolderInput, UpdateFolderInput } from '../folder/folder.input';
import { FolderService } from './folder.service';
import { Folder } from '../folder/folder.schema';

@Resolver((of) => Folder)
export class FolderResolver {
  constructor(private folderService: FolderService) {}

  @Mutation((returns) => Folder)
  async createFolder(@Args('values') values: CreateFolderInput) {
    return this.folderService.create(values);
  }

  @Query((returns) => [Folder])
  async getFolders() {
    return this.folderService.findAll();
  }

  @Query((returns) => Folder)
  async getById(@Args('id') id: string) {
    return this.folderService.getById(id);
  }

  @Mutation((returns) => Folder)
  async updateFolder(@Args('values') values: UpdateFolderInput) {
    return this.folderService.update(values);
  }

  @Mutation((returns) => Folder)
  async deleteFolder(@Args('id') id: string) {
    return this.folderService.delete(id);
  }
}
