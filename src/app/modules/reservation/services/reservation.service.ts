import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IGetCustomer, IGetServices } from '../interfaces';
import { IBasicDbResponse } from '../../../shared/models';
import { IGetReservation, IPostReservation, Reservation } from '../interfaces/reservation.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly _http = inject(HttpClient);
  private readonly urlBack = environment.urlBack;
  constructor() { }

  //#region

  /**
   * Método https
   *
   * Método que trae todos los clientes de DB
   * @returns {IBasicDbResponse<IGetCustomer>}
   */
  getCustomer(): Observable<IBasicDbResponse<IGetCustomer[]>> {
    const url = `${this.urlBack}/api/Reservations/getCustomers`;
    return this._http.get<IBasicDbResponse<IGetCustomer[]>>(url);
  }
  /**
   * Método https
   *
   * Método que trae la reservacion por id
   * @param {HttpParams} param
   * @returns {IGetReservation} reservación
   */
  getReservationById(param: HttpParams): Observable<Reservation> {
    const url = `${this.urlBack}/api/Reservations/reservationsById`;
    return this._http.get<Reservation>(url, {params: param});
  }

  /**
   * Método https
   *
   * Método que trae todos los servicios de DB
   * @returns {IBasicDbResponse<IGetCustomer>}
   */
  getService(): Observable<IBasicDbResponse<IGetServices[]>> {
    const url = `${this.urlBack}/api/Reservations/getServices`;
    return this._http.get<IBasicDbResponse<IGetServices[]>>(url);
  }

  /**
   * Método https
   *
   * Método que trae todos los servicios de DB
   * @param { HttpParams } param
   * @returns {IBasicDbResponse<IGetCustomer>} return IGetCustomer
   */
  getReservations(param: HttpParams): Observable<IBasicDbResponse<IGetReservation[]>> {
    const url = `${this.urlBack}/api/Reservations/getReservations`;
    return this._http.get<IBasicDbResponse<IGetReservation[]>>(url, { params: param });
  }

  /**
   * Método https
   *
   * Creacion reservacion
   * @param {IPostReservation} data
   * @returns {Observable} return
   */
  postReservation(data: IPostReservation) {
    const url = `${this.urlBack}/api/Reservations/createReservation`;
    return this._http.post(url, data);
  }
  /**
   * Método https
   *
   * Edición reservacion
   * @param {string} idReservation
   * @param {IPostReservation} data
   * @returns {Observable} return
   */
  putReservation(idReservation: string, data: IPostReservation) {
    const url = `${this.urlBack}/api/Reservations/updateReservation/${idReservation}`;
    return this._http.put(url, data);
  }

  /**
   * Método https
   *
   * Delete reservatión
   * @param {number} idReservation
   * @returns
   */
  deleteReservation(idReservation: number){
    const url = `${this.urlBack}/api/Reservations/deleteReservation/${idReservation}`;
    return this._http.delete(url);
  }
  //#endregion
}
