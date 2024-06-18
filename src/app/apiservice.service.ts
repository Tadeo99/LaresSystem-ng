import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DataService } from './core/services';

@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  // Conectar Frontend con Backend
  apiUrl = 'http://localhost:6500/clientes';

  constructor(private dataService: DataService) {}

  // listar emision
  validaRegistro(request: any): Observable<any> {
    const pathService = environment.urlService + 'validaRegistro';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  //validar usuario según el cambio de contraseña
  validaUsuario(request: any): Observable<any> {
    const pathService = environment.urlService + 'userValidation';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  // Validar nueva contraseña
  cambiarPassword(request: any): Observable<any> {
    const pathService = environment.urlService + 'changePassword';
    this.dataService.set(pathService);
    return this.dataService.execPutJson(request);
  }

  // iniciar emision
  login(request: any): Observable<any> {
    const pathService = environment.urlService + 'login';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  // iniciar emision
  bulkBatch(request: any): Observable<any> {
    const pathService = environment.urlService + 'clientes';
    this.dataService.set(pathService);
    return this.dataService.execPostJson(request);
  }

  //validar usuario según el cambio de contraseña
  obtenerContrato(request: any): Observable<any> {
    const pathService = environment.urlService + 'contract';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  obtenerTipoCambioSunat(request: any): Observable<any> {
    const pathService = environment.urlServiceSunat + 'v2/sunat/tipo-cambio';
    console.log(pathService + request.date);
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  obtenerProximaLetra(request: any): Observable<any> {
    const pathService = environment.urlService + 'nextLetter';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  obtenerLastPayment(request: any): Observable<any> {
    const pathService = environment.urlService + 'lastPayment';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

  obtenerHistorial(request: any): Observable<any> {
    const pathService = environment.urlService + 'recordPayment';
    this.dataService.set(pathService);
    return this.dataService.execGet(request).pipe();
  }

}
