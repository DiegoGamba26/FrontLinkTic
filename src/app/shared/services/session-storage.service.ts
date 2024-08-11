import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  private isStorageAvailable: boolean;
  private isLocalAvailable: boolean;
  
  constructor() {
    this.isStorageAvailable = this.isSessionStorageAvailable();
    this.isLocalAvailable= this.isLocalStorageAvailable();
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  setItem<T>(key: string, data: T): void {
    if (this.isStorageAvailable) {
      const hashData = btoa(
        typeof data === 'string' ? data : JSON.stringify(data)
      );
      sessionStorage.setItem(key, hashData);
    }
  }

  getItem<T>(key: string): T | undefined {
    if (this.isStorageAvailable) {
      const item = sessionStorage.getItem(key);
      if (!item) return undefined;
      const deserializeObj = atob(item);
      try {
        return JSON.parse(deserializeObj);
      } catch {
        return deserializeObj as T;
      }
    }
    return undefined;
  }

  setLocalStorage<T>(key: string, data: T) {
    if (this.isLocalAvailable) {
      const encodeData = btoa(
        typeof data === 'string' ? data : JSON.stringify(data)
      );
      localStorage.setItem(key, encodeData);
    }
  }

  getLocalStorage<T>(key: string): T | undefined {
    if(this.isLocalAvailable){
      const item = localStorage.getItem(key);
      if (!item) return;
  
      const deserializeObj = atob(item);
      try {
        return JSON.parse(deserializeObj);
      } catch {
        return deserializeObj as T;
      }
    }
    return undefined;
  }

  clearStorage() {
    if (this.isStorageAvailable){
      sessionStorage.clear();
    }
  }

  removeItemStorage(key: string) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

}
