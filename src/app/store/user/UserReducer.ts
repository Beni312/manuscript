import { UserActions, UserActionTypes } from './UserActions';
import { Author } from '../../models/author';

export interface UserState {
  users: Array<Author>;
}

export const initialState: UserState = {
  users: []
};

export function userReducer(state: UserState = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.INIT_USERS:
      return {
        ...state,
        users: action.payload.users
      };
    case UserActionTypes.ADD_USER:
      return {
        ...state,
        users: [
          ...state.users,
          action.payload
        ]
      };
    case UserActionTypes.REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(item => item.id !== action.payload)
      };
    default: return state;
  }
}
