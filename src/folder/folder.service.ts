import mongoose, { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFolderInput,
  FoldersWithNoteCount,
  UpdateFolderInput,
} from './folder.input';
import { Folder, FolderDocument } from './folder.schema';
import { InjectModel } from '@nestjs/mongoose';

const foldersWithNotesCountPipeline = [
  {
    $lookup: {
      from: 'notes', // from the other side collection relationship
      localField: '_id',
      foreignField: 'folder',
      as: 'notes',
    },
  },
  {
    $sort: {
      updatedAt: -1,
    },
  },
  {
    $project: {
      _id: 0, // remove field _id
      id: '$_id', // rename field _id to id
      name: 1,
      updatedAt: 1,
      notesCount: {
        $size: '$notes',
      },
    },
  },
];

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>
  ) {}

  async create(values: CreateFolderInput, userId: string): Promise<Folder> {
    const newValues = { ...values, user: userId };
    const createdFolder = new this.folderModel(newValues);
    return createdFolder.save();
  }

  async findAll(): Promise<Folder[]> {
    return await this.folderModel.find().populate('user').exec();
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

  async findFoldersWithNotesCount(): Promise<FoldersWithNoteCount[]> {
    const data = await this.folderModel.aggregate(
      foldersWithNotesCountPipeline as any
    );
    return data;
  }

  // -------------------------------------------- //
  // ------------------- USER ------------------- //
  // -------------------------------------------- //
  async findUserFoldersWithNotesCount(
    userId: string
  ): Promise<FoldersWithNoteCount[]> {
    const userPipeline = {
      $match: {
        $expr: { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
      },
    };
    const newPipeline: any = [userPipeline, ...foldersWithNotesCountPipeline];

    const data = await this.folderModel.aggregate(newPipeline as any);
    return data;
  }

  async findAllByUser(userId: string): Promise<Folder[]> {
    return await this.folderModel
      .find({ user: userId })
      .populate('user')
      .exec();
  }

  // get one note by the current user
  async getByIdAndUser(id: string, userId: string): Promise<Folder> {
    const note = await this.folderModel
      .findOne({ $and: [{ _id: id }, { user: userId }] })
      .exec();

    if (!note) {
      throw new NotFoundException('Folder not found');
    }
    return note;
  }

  async updateByUser(id: string, userId: string, values: UpdateFolderInput) {
    return await this.folderModel
      .findOneAndUpdate(
        { $and: [{ _id: id }, { user: userId }] },
        { $set: values },
        { new: true }
      )
      .exec();
  }

  async deleteByUser(id: string, userId: string) {
    return await this.folderModel
      .findOneAndDelete({ $and: [{ _id: id }, { user: userId }] })
      .exec();
  }

  async deleteManyByUser(ids: string[], userId: string) {
    const data = await this.folderModel.deleteMany({
      $and: [{ _id: { $in: ids } }, { user: userId }],
    });

    if (data && data.acknowledged) return true;
    return false;
  }

  async deleteAllByUser(userId: string) {
    const data = await this.folderModel.deleteMany({ user: userId });

    if (data && data.acknowledged) return true;
    return false;
  }
}
