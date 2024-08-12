import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ILogin, IResLogin } from '../interfaces/login.interface';
import { Observable } from 'rxjs';
import { skipNoToken } from '../../../shared/interceptors/http-context';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _http = inject(HttpClient);
  private readonly urlBack = environment.urlBack;
  constructor() { }

  //#region

  /**
   * Método Https
   * 
   * Método para ingresar a la aplicación
   * @param {ILogin} data 
   * @returns {IResLogin} 
   */
  login(data: ILogin): Observable<IResLogin>{
    const url = `${this.urlBack}`;
    return this._http.post<IResLogin>(url, data, {context: skipNoToken()});
  }
  //#endregion
}
