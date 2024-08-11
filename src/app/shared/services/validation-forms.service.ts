import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationFormsService {

  constructor() { }

  getErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    } else if (control?.hasError('email')) {
      return 'No es un correo válido';
    } else if (control?.hasError('minlength')) {
      return `El tamaño mínimo es de ${control.errors?.['minlength'].requiredLength} caracteres`;
    } else if (control?.hasError('maxlength')) {
      return `El tamaño máximo es de ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }else if (control?.hasError('passwordMismatch')) {
      return `las contraseñas no coinciden`;
    }
    return '';
  }

  public cleanControls(oFormGroup: FormGroup, nameControls: string) {
    oFormGroup.controls[`${nameControls}`].setValue(null);
    oFormGroup.controls[`${nameControls}`].clearValidators();
    oFormGroup.controls[`${nameControls}`].setErrors(null);
    oFormGroup.controls[`${nameControls}`].updateValueAndValidity();
  }

  public requiereControls(oFormGroup: FormGroup, nameControls: string, controls: ValidatorFn | ValidatorFn[]) {
    oFormGroup.controls[`${nameControls}`].setValue(null);
    oFormGroup.controls[`${nameControls}`].addValidators(controls);
    oFormGroup.controls[`${nameControls}`].updateValueAndValidity();
    oFormGroup.controls[`${nameControls}`].markAllAsTouched();
  }

  public passwordMatchValidator(
    password: string,
    passwordCfr: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: unknown } | null => {
      const passwordControl = formGroup.get(password);
      const passwordCfrControl = formGroup.get(passwordCfr);

      if (!passwordControl || !passwordCfrControl) {
        return null;
      }

      if (
        passwordCfrControl.errors &&
        !passwordCfrControl.errors['passwordMismatch']
      ) {
        // Return if another validator has already found an error on the passwordCfrControl
        return null;
      }

      if (passwordControl.value !== passwordCfrControl.value) {
        passwordCfrControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        passwordCfrControl.setErrors(null);
        return null;
      }
    };
  }
}
