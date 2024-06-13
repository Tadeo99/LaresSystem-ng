export class Usuario {
    documentoCliente: string;
    tipoDocumento: string;
    nombre: string;
    cliente: string;
    telefono: string;
    celulares: string;
    usuario: string;
    token: string; // Agregamos una propiedad para el token de autenticación

    constructor(
      documentoCliente: string,
      tipoDocumento: string,
      nombre: string,
      cliente: string,
      telefono: string,
      celulares: string,
      usuario: string,
      token: string // También incluimos el token en el constructor
    ) {
      this.documentoCliente = documentoCliente;
      this.tipoDocumento = tipoDocumento;
      this.nombre = nombre;
      this.cliente = cliente;
      this.telefono = telefono;
      this.celulares = celulares;
      this.usuario = usuario;
      this.token = token; // Asignamos el token al atributo correspondiente
    }
  }