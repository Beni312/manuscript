import { Action } from '@ngrx/store';
import { SystemDataState } from './SystemDataReducer';

export enum SystemDataActionTypes {
  INIT_SYSTEM_DATA = 'Init system data'
}

export class InitSystemData implements Action {
  readonly type = SystemDataActionTypes.INIT_SYSTEM_DATA;

  constructor(public payload: SystemDataState) {}
}

export type SystemDataActions =
  InitSystemData;
