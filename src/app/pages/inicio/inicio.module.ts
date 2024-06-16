import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/shared/shared.module';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { GeneralComponent } from './include/general/general.component';
import { PagosComponent } from './include/pagos/pagos.component';
import { inmuebleComponent } from './include/inmueble/inmueble.component';
import { SharedPages } from '@pages/shared/shared-pages.module';
@NgModule({
  declarations: [
    InicioComponent,GeneralComponent,PagosComponent,inmuebleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    InicioRoutingModule,
    SharedPages
  ],
  exports: [
    InicioComponent
  ]
})
export class InicioModule { }