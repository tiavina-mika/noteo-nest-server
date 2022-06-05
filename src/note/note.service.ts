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
    return await this.noteModel.find().exec();
  }

  async getById(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(id);
    }
    return note;
  }

  async update(values: UpdateNoteInput) {
    return await this.noteModel
      .findByIdAndUpdate(values.id, values, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.noteModel.findByIdAndDelete(id).exec();
  }
}