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
import { ResponsePaging } from 'src/utils/response/response.input';
import {
  FOLDER_DEFAULT_AVAILABLE_SEARCH,
  FOLDER_DEFAULT_AVAILABLE_SORT,
  FOLDER_DEFAULT_PER_PAGE,
  FOLDER_DEFAULT_SORT,
} from './folder.constant';

@InputType()
export class CreateFolderInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateFolderInput {
  @Field()
  name: string;
}

@ObjectType()
export class FoldersWithNoteCountResult {
  @Field()
  id: string;

  @Field()
  notesCount: number;

  @Field()
  name: string;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PaginatedFoldersResult extends ResponsePaging {
  @Field(() => [FoldersWithNoteCountResult])
  data: Record<string, any>[];
}

@InputType()
export class FolderListInput implements PaginationListAbstract {
  @PaginationSearch()
  @Field(() => String, { nullable: true })
  readonly search: string;

  @PaginationAvailableSearch(FOLDER_DEFAULT_AVAILABLE_SEARCH)
  @Field(() => [String], {
    defaultValue: FOLDER_DEFAULT_AVAILABLE_SEARCH,
    nullable: true,
  })
  readonly availableSearch?: string[];

  @PaginationPage(FOLDER_DEFAULT_PER_PAGE)
  @Field(() => Number)
  readonly page: number;

  @PaginationPerPage(FOLDER_DEFAULT_PER_PAGE)
  @Field(() => Number)
  readonly perPage: number;

  @PaginationSort(FOLDER_DEFAULT_SORT, FOLDER_DEFAULT_AVAILABLE_SORT)
  @Field(() => String)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(FOLDER_DEFAULT_AVAILABLE_SORT)
  @Field(() => [String], { nullable: true })
  readonly availableSort?: string[];
}
