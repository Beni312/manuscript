import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class UtilsService {
  static minLengthArray(min: number) {
    return (c: AbstractControl): {[key: string]: any} => {
      if (c.value.length >= min) {
        return null;
      }
      return { 'minLengthArray': { valid: false }};
    };
  }
}
