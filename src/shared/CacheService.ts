import { Injectable, InjectionToken, Inject } from '@angular/core';

// Define un token de inyección para la clave de CacheService
export const CLAVE_CACHE_TOKEN = new InjectionToken<string>('clave_cache_token');

@Injectable({
  providedIn: 'root'
})
export class CacheService<T> {

  private contratoKey: string;
  private contrato: T | null;

  constructor(@Inject(CLAVE_CACHE_TOKEN) private clave: string) {
    this.contratoKey = this.clave;
    const contratoString = localStorage.getItem(this.contratoKey);
    this.contrato = contratoString ? JSON.parse(contratoString) : null;
  }

  public setCache(data: T) {
    this.contrato = data;
    localStorage.setItem(this.contratoKey, JSON.stringify(data));
  }

  public getCache(): T | null {
    return this.contrato;
  }

  public deleteCache() {
    this.contrato = null;
    localStorage.removeItem(this.contratoKey);
  }
}