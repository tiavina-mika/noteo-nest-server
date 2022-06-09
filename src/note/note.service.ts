import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteInput, UpdateNoteInput } from './note.input';
import { Note, NoteDocument } from './note.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(values: CreateNoteInput): Promise<Note> {
    const createdNote = new this.noteModel(values);
    return createdNote.save();
  }

  async findAll(): Promise<Note[]> {
    return await this.noteModel.find().populate('folder').exec();
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
        folder: { $exists: false },
        deleted: { $ne: true },
      })
      .exec();

    return notes;
  }

  async getNotesFromRecycleBin(): Promise<Note[]> {
    const notes = await this.noteModel.find({ deleted: true }).exec();

    return notes;
  }

  async update(id: string, values: UpdateNoteInput) {
    return await this.noteModel
      .findByIdAndUpdate(id, values, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.noteModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(ids: any[]) {
    return await this.noteModel.deleteMany({ _id: { $in: ids } });
  }

  async moveToRecycleBin(id: string, value: boolean) {
    return await this.noteModel
      .findByIdAndUpdate(id, { deleted: value }, { new: true })
      .exec();
  }
}
