import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Esto asegura que Angular lo inyecte automáticamente en toda la aplicación
})
export class CacheGeneralService {
  
  private cache: Map<string, any> = new Map<string, any>();

  constructor() {}

  setCache(key: string, value: any): void {
    this.cache.set(key, value);
  }

  getCache(key: string): any {
    return this.cache.get(key);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
