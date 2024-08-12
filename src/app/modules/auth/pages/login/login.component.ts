import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoginService } from '../../services/login.service';
import { ValidationFormsService } from '../../../../shared/services/validation-forms.service';
import { AlertsService } from '../../../../shared/services/alerts.service';
import { ILogin } from '../../interfaces/login.interface';
import { SessionStorageService } from '../../../../shared/services/session-storage.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _alertsSvc = inject(AlertsService);
  private readonly _authLoginSvc = inject(LoginService);
  private readonly _validationFormsS = inject(ValidationFormsService);
  private readonly _sessionStorageSvc = inject(SessionStorageService);
  private readonly router = inject(Router);

  protected hidePassword = true;
  protected oFormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected getErrorMessage(controlName: string): string {
    const control = this.oFormGroup.get(controlName);
    return this._validationFormsS.getErrorMessage(control);
  }

  protected login() {
    const data: ILogin = {
      userEmail: String(this.oFormGroup.controls.email.value),
      password: String(this.oFormGroup.controls.password.value),
    }
    this._authLoginSvc.login(data).subscribe({
      next: (oRes)=>{
        this._sessionStorageSvc.setItem(environment.AppTokenKey, oRes.token);
        this.router.navigateByUrl('/reservation/home');
      },error: ()=>{

      }
    })
  }
}
