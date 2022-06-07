import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Folder } from '../folder/folder.schema';
import { transformMongoDBIdentifier } from '../utils/utils';

export type NoteDocument = Note & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Note {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field()
  title: string;

  @Prop()
  @Field()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Folder.name })
  @Field({ nullable: true })
  folder?: Folder;

  @Prop()
  @Field(() => Date, { description: 'Created At' })
  createdAt?: Date;

  @Prop()
  @Field(() => Date, { description: 'Updated At' })
  updatedAt?: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.set('toJSON', {
  transform: transformMongoDBIdentifier,
});
