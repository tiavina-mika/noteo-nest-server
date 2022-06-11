import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolderInput, UpdateFolderInput } from './folder.input';
import { Folder, FolderDocument } from './folder.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>
  ) {}

  async create(values: CreateFolderInput): Promise<Folder> {
    const createdFolder = new this.folderModel(values);
    return createdFolder.save();
  }

  async findAll(): Promise<Folder[]> {
    return await this.folderModel.find().exec();
  }

  async getById(id: string): Promise<Folder> {
    const folder = await this.folderModel.findById(id).exec();
    if (!folder) {
      throw new NotFoundException(id);
    }
    return folder;
  }

  async update(id: string, values: UpdateFolderInput) {
    return await this.folderModel
      .findByIdAndUpdate(id, values, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.folderModel.findByIdAndDelete(id).exec();
  }

  async deleteAll() {
    const data = await this.folderModel.deleteMany({});

    if (data && data.acknowledged) return true;
    return false;
  }
}
