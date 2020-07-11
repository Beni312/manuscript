import { createFeatureSelector } from '@ngrx/store';
import { UserState } from './UserReducer';

export const getUsersState = createFeatureSelector<UserState>('users');
