import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Schema } from 'mongoose';
import { User } from '../users/users.schema';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResult {
  @Field(() => User)
  user: User;
  @Field(() => String)
  token: string;
}

export interface JwtPayload {
  email: string;
  id: Schema.Types.ObjectId;
  // expiration?: Date;
  expiresIn?: string;
}
