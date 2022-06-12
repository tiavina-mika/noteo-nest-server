import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { transformMongoDBIdentifier, validateEmail } from '../utils/utils';

export type UserDocument = User &
  Document & {
    password: string;
    // lowercaseEmail: string;
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
    validate: { validator: validateEmail },
  })
  email: string;

  @Field(() => String)
  @Prop({
    // required: true,
    unique: true,
  })
  username?: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Field((type) => String, { nullable: true })
  @Prop()
  lastName?: string;

  @Prop({ required: true })
  password: string;

  @Field(() => [String])
  @Prop({
    type: [String],
    // required: true,
  })
  permissions?: string[];

  // @Field(() => String)
  // @Prop({
  //   type: String,
  //   unique: true,
  // })
  // lowercaseEmail: string;

  // @Prop({ type: PasswordResetSchema })
  // passwordReset: typeof PasswordResetSchema;

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

  next();

  // Make sure not to rehash the password if it is already hashed
  // if (!user.isModified('password')) {
  //   return next();
  // }

  // Generate a salt and use it to hash the user's password
  // bcrypt.genSalt(10, (genSaltError, salt) => {
  //   if (genSaltError) {
  //     return next(genSaltError);
  //   }

  //   bcrypt.hash(user.password, salt, (err, hash) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     user.password = hash;
  //     next();
  //   });
  // });
});

UserSchema.set('toJSON', {
  transform: transformMongoDBIdentifier,
});
