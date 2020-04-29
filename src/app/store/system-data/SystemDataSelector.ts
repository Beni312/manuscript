import { createFeatureSelector } from '@ngrx/store';
import { MessageState } from '../message/MessageReducer';

export const getSystemData = createFeatureSelector<MessageState>('systemData');
