import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/shared/shared.module';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
@NgModule({
  declarations: [
    RegistroComponent
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
    RegistroRoutingModule,
  ],
  exports: [
    RegistroComponent
  ]
})
export class RegistroModule { }