import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates email format using a comprehensive regex.
 * @returns Validator function
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(value);

    return !valid ? { invalidEmail: true } : null;
  };
}
