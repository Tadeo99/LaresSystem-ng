import { Injectable } from '@angular/core';
import { Usuario } from './models/common/clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarioKey = 'usuario'; // Clave para el usuario en el almacenamiento local

  constructor() { 
    // Al inicializar el servicio, intenta cargar el usuario del almacenamiento local
    const usuarioString = localStorage.getItem(this.usuarioKey);
    this.usuario = usuarioString ? JSON.parse(usuarioString) : null;
  }

  private usuario: Usuario | null;

  public setUsuario(usuario: Usuario) {
    this.usuario = usuario;
    // Almacenar el usuario en el almacenamiento local
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  public getUsuario() {
    return this.usuario;
  }

  public deleteUsuario() {
    this.usuario = null;
    // Eliminar el usuario del almacenamiento local
    localStorage.removeItem(this.usuarioKey);
  }
  
}
