import { HttpContext, HttpContextToken } from '@angular/common/http';

// Declare http context tokens here...
export const NO_TOKEN = new HttpContextToken<boolean>(() => false);

export const NO_REFRESH_KEY = new HttpContextToken<boolean>(() => false);

/**
 * Evitar adicionar el token en los headers
 * @returns
 */
export function skipNoToken() {
  return new HttpContext().set(NO_TOKEN, true);
}

/**
 * Evita refrescar el token
 * @returns
 */
export function skipNoRefrestKey() {
  return new HttpContext().set(NO_REFRESH_KEY, true);
}
