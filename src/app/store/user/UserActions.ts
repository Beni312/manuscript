import { Action } from '@ngrx/store';
import { Author } from '../../models/author';
import { UserState } from './UserReducer';

export enum UserActionTypes {
  INIT_USERS = 'Init users',
  ADD_USER = 'Add user',
  REMOVE_USER = 'Remove user'
}

export class InitUsers implements Action {
  readonly type = UserActionTypes.INIT_USERS;

  constructor(public payload: UserState) {}
}

export class AddUser implements Action {
  readonly type = UserActionTypes.ADD_USER;

  constructor(public payload: Author) {}
}

export class RemoveUser implements Action {
  readonly type = UserActionTypes.REMOVE_USER;

  constructor(public payload: number) {}
}

export type UserActions =
  InitUsers |
  AddUser |
  RemoveUser;
