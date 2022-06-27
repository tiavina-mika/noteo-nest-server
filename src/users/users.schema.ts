import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { transformMongoDBIdentifier, validateEmail } from '../utils/utils';

export type UserDocument = User &
  Document & {
    password: string;
    passwordReset?: {
      token: string;
      expiration: Date;
    };
    checkPassword(password: string): Promise<boolean>;
  };

export const PasswordResetSchema: MongooseSchema = new MongooseSchema({
  token: { type: String, required: true },
  expiration: { type: Date, required: true },
});

@ObjectType()
@Schema()
export class Token {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  token: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => String)
  id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: { validator: validateEmail },
  })
  email: string;

  @Field(() => String)
  @Prop({
    unique: true,
  })
  username?: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    lowercase: true,
    trim: true,
  })
  lastName?: string;

  @Prop({ required: true })
  password: string;

  @Field(() => [String])
  @Prop({
    type: [String],
    // required: true,
  })
  permissions?: string[];

  @Field(() => Boolean)
  @Prop({
    type: Boolean,
    default: false,
  })
  enabled?: boolean;

  @Prop()
  @Field(() => Date, { description: 'Created At' })
  createdAt?: Date;

  @Prop()
  @Field(() => Date, { description: 'Updated At' })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.validateEmail = function (email: string): boolean {
  return validateEmail(email);
};

UserSchema.pre<UserDocument>('save', function (next) {
  const lowerCasedEmail = this.email.toLowerCase();
  this.email = lowerCasedEmail;
  this.username = lowerCasedEmail;
  this.firstName = this.firstName.toLowerCase();

  if (this.lastName) {
    this.lastName = this.lastName.toLowerCase();
  }

  next();
});

UserSchema.set('toJSON', {
  transform: transformMongoDBIdentifier,
});

UserSchema.methods.checkPassword = (password: string): Promise<boolean> => {
  const user = this as UserDocument;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};
