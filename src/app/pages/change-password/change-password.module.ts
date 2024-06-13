import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALIDATORS,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/shared/shared.module';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import {
  ChangePasswordComponent
} from './change-password.component';
@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    ChangePasswordRoutingModule,
  ],
  exports: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
