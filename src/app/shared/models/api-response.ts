
/**
 * Interfaz que representa una respuesta básica de el back-end.
 * 
 * @template T - El tipo del valor que se devuelve en la respuesta.
 */
export interface IBasicDbResponse<T> {
  /**
   * El valor devuelto desde el back-end.
   * 
   * @type {string}
   */
  message: string;

  /**
   * El resultado de la acción asociado con la respuesta.
   * 
   * @type {T}
   */
  data: T;
}
