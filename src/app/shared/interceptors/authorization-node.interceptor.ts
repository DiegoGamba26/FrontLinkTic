import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, retry } from 'rxjs';
import { NO_REFRESH_KEY, NO_TOKEN } from './http-context';
import { SessionStorageService } from '../services/session-storage.service';
import { environment } from '../../../environments/environment';

export const authorizationNodeInterceptor: HttpInterceptorFn = (req, next) => {
  const sesionStorageSvc = inject(SessionStorageService);
  const token = sesionStorageSvc.getItem<string>(environment.AppTokenKey);

  let headers = new HttpHeaders({
    'Cache-Control':
      'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    Pragma: 'no-cache',
    Expires: '0',
    'Content-Type': 'application/json',
    Connection: 'close',
  });

  if (!req.context.get(NO_TOKEN) && token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloneReq = req.clone({
    headers,
  });

  return next(cloneReq);
};
