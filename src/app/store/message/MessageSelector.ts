import { createFeatureSelector } from '@ngrx/store';
import { MessageState } from './MessageReducer';

export const getMessageState = createFeatureSelector<MessageState>('message');
