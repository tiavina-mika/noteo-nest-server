import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  folder?: String;
}

@InputType()
export class UpdateNoteInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;
}
