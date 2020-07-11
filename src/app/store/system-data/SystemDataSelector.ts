import { createFeatureSelector } from '@ngrx/store';
import { SystemDataState } from './SystemDataReducer';

export const getSystemData = createFeatureSelector<SystemDataState>('systemData');
