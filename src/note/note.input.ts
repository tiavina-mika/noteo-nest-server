import { ResponsePaging } from './../utils/response/response.input';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PaginationListAbstract } from 'src/utils/pagination/pagination.abstract';
import {
  PaginationAvailableSearch,
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSearch,
  PaginationSort,
} from 'src/utils/pagination/pagination.decorator';
import { IPaginationSort } from 'src/utils/pagination/pagination.interface';
import {
  NOTE_DEFAULT_AVAILABLE_SEARCH,
  NOTE_DEFAULT_AVAILABLE_SORT,
  NOTE_DEFAULT_PER_PAGE,
  NOTE_DEFAULT_SORT,
} from './note.constant';
import { Note } from './note.schema';

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

@InputType()
export class NoteListInput implements PaginationListAbstract {
  @PaginationSearch()
  @Field(() => String, { nullable: true })
  readonly search: string;

  @PaginationAvailableSearch(NOTE_DEFAULT_AVAILABLE_SEARCH)
  @Field(() => [String], {
    defaultValue: NOTE_DEFAULT_AVAILABLE_SEARCH,
    nullable: true,
  })
  readonly availableSearch?: string[];

  @PaginationPage(NOTE_DEFAULT_PER_PAGE)
  @Field(() => Number)
  readonly page: number;

  @PaginationPerPage(NOTE_DEFAULT_PER_PAGE)
  @Field(() => Number)
  readonly perPage: number;

  @PaginationSort(NOTE_DEFAULT_SORT, NOTE_DEFAULT_AVAILABLE_SORT)
  @Field(() => String)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(NOTE_DEFAULT_AVAILABLE_SORT)
  @Field(() => [String], { nullable: true })
  readonly availableSort?: string[];
}

@ObjectType()
export class PaginatedNotesResult extends ResponsePaging {
  @Field(() => [Note])
  data: Record<string, any>[];
}
