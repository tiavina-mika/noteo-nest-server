export enum ENUM_NOTE_STATUS_CODE_ERROR {
  NOTE_NOT_FOUND_ERROR = 5400,
  NOTE_EXISTS_ERROR = 5401,
}

export const NOTE_ACTIVE_META_KEY = 'UserActiveMetaKey';
export const NOTE_DEFAULT_PAGE = 1;
export const NOTE_DEFAULT_PER_PAGE = 10;
export const NOTE_DEFAULT_SORT = 'name@asc';
export const NOTE_DEFAULT_AVAILABLE_SORT = ['updatedAt', 'title', 'content'];
export const NOTE_DEFAULT_AVAILABLE_SEARCH = ['title', 'content'];
