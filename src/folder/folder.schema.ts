import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { transformMongoDBIdentifier } from 'src/utils/utils';

export type FolderDocument = Folder & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Folder {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field(() => Date, { description: 'Created At' })
  createdAt?: Date;

  @Prop()
  @Field(() => Date, { description: 'Updated At' })
  updatedAt?: Date;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

FolderSchema.set('toJSON', {
  transform: transformMongoDBIdentifier,
});
