import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  folder?: string;
}

@InputType()
export class UpdateNoteInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;
}

@InputType()
export class RecycleBinNotesInput {
  @Field(() => [String])
  ids: string[];

  @Field()
  value: boolean;
}
