import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponsePaging {
  @Field(() => Number)
  totalData: number;

  @Field(() => Number)
  totalPage?: number;

  @Field(() => Number)
  currentPage?: number;

  @Field(() => Number)
  perPage?: number;

  @Field(() => [String])
  availableSearch?: string[];

  @Field(() => [String])
  availableSort?: string[];
}
