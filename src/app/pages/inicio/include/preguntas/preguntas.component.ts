import { Component, OnInit,Input } from '@angular/core';
import { UsuarioService } from 'src/shared/usuarioService';
import { Usuario } from 'src/shared/models/common/clases/usuario';
@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasFrecuentesComponent implements OnInit {
  @Input() contratoSeleccionado: any;
  datos: any;
  usuario: Usuario | null;
  tipoDocumento: any;
  numDocumento: any;

  constructor(private usuarioService: UsuarioService,) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.recuperarParametros();
    //this.obtenerContrato();
  }

  recuperarParametros() {
    this.tipoDocumento = this.usuario?.tipoDocumento;
    this.numDocumento = this.usuario?.documentoCliente;
  }

  toggleAccordion(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('show');
    }
  }
}
