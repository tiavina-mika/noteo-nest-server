import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecycleBinNotesInput } from '../note.input';
import { Note, NoteDocument } from '../note.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}
  async findAll(): Promise<Note[]> {
    return await this.noteModel
      .find()
      .populate('folder')
      .populate('user')
      .exec();
  }

  async getById(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(id);
    }
    return note;
  }

  async getByFolderId(folderId: string): Promise<Note[]> {
    const notes = await this.noteModel
      .find({ folder: folderId })
      .populate('folder')
      .exec();

    return notes;
  }

  async getNotesWithoutFolder(): Promise<Note[]> {
    const notes = await this.noteModel
      .find({
        $or: [{ folder: { $eq: null } }, { folder: { $exists: false } }],
        deleted: { $ne: true },
      })
      .exec();

    return notes;
  }

  async getNotesFromRecycleBin(): Promise<Note[]> {
    const notes = await this.noteModel.find({ deleted: true }).exec();

    return notes;
  }

  async delete(id: string) {
    return await this.noteModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(ids: any[]) {
    const data = await this.noteModel.deleteMany({ _id: { $in: ids } });

    if (data && data.acknowledged) return true;
    return false;
  }

  async deleteManyFromRecycleBin(ids: string[]) {
    return await this.noteModel.deleteMany({
      _id: { $in: ids },
      deleted: true,
    });
  }

  async deleteAllFromRecycleBin() {
    const data = await this.noteModel.deleteMany({
      deleted: true,
    });

    if (data && data.acknowledged) return true;
    return false;
  }

  async moveToRecycleBin(id: string, value: boolean) {
    return await this.noteModel
      .findByIdAndUpdate(id, { deleted: value }, { new: true })
      .exec();
  }

  async moveManyToRecycleBin(values: RecycleBinNotesInput): Promise<boolean> {
    const data = await this.noteModel.updateMany(
      { _id: { $in: values.ids } },
      { $set: { deleted: values.value } }
    );

    if (data.acknowledged) {
      return true;
    }

    return false;
  }

  async moveManyToRecycleBinAndDeleteFolder(ids: string[]): Promise<boolean> {
    const data = await this.noteModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true, folder: null } }
    );

    if (data.acknowledged) {
      return true;
    }

    return false;
  }
}
