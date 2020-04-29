import { AcademicDiscipline } from '../../models/academic.discipline';
import { Role } from '../../models/role';
import { SystemDataActions, SystemDataActionTypes } from './SystemDataActions';

export interface SystemDataState {
  academicDisciplines: AcademicDiscipline[];
  roles?: Role[];
}

export const initialState: SystemDataState = {
  academicDisciplines: [],
  roles: []
};

export function systemDataReducer(state: SystemDataState = initialState, action: SystemDataActions): SystemDataState {
  switch (action.type) {
    case SystemDataActionTypes.INIT_SYSTEM_DATA: return {
      ...action.payload
    };
  }
}

