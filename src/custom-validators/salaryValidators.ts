import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const salaryRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minSalary = control.get('minSalary')?.value;
  const maxSalary = control.get('maxSalary')?.value;

  if (minSalary && maxSalary && minSalary >= maxSalary) {
    return { salaryRange: true };
  }
  return null;
};
