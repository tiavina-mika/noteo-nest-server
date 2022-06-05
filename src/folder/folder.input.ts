import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFolderInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateFolderInput {
  @Field()
  id: string;

  @Field()
  name: string;
}