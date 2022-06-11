import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateFolderInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateFolderInput {
  @Field()
  name: string;
}

@ObjectType()
export class FoldersWithNoteCount {
  @Field()
  id: string;

  @Field()
  notesCount: number;

  @Field()
  name: string;

  @Field()
  updatedAt: Date;
}
