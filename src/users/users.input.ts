import { Field, InputType } from '@nestjs/graphql';
import { LoginInput } from '../auth/auth.input';

@InputType()
export class CreateUserInput extends LoginInput {
  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;
}
