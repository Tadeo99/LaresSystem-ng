import { Injectable } from '@angular/core';
import { Contrato } from './models/common/clases/contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private contratoKey = 'contrato'; // Clave para el usuario en el almacenamiento local

  constructor() { 
    // Al inicializar el servicio, intenta cargar el usuario del almacenamiento local
    const usuarioString = localStorage.getItem(this.contratoKey);
    this.contrato = usuarioString ? JSON.parse(usuarioString) : null;
  }

  private contrato: Contrato | null;

  public setContrato(contrato: Contrato) {
    this.contrato = contrato;
    // Almacenar el usuario en el almacenamiento local
    localStorage.setItem(this.contratoKey, JSON.stringify(contrato));
  }

  public getContrato() {
    return this.contrato;
  }

  public deleteContrato() {
    this.contrato = null;
    // Eliminar el usuario del almacenamiento local
    localStorage.removeItem(this.contratoKey);
  }
  
}
