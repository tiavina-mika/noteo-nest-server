import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  folder: String;
}

@InputType()
export class UpdateNoteInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
