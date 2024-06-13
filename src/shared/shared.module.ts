import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from './components/alert/alert.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { HtmlPipe,KeysPipe, LogPipe } from './components/pipes';
import { CustomDatePipe } from './components/pipes/customDate.pipe';
@NgModule({
  declarations: [
    LogPipe,
    KeysPipe,
    HtmlPipe,
    CustomDatePipe,
    LoaderComponent,
    AlertComponent,
    ModalMessageComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoaderComponent,
    CustomDatePipe,
    AlertComponent,
    ModalMessageComponent,
    HtmlPipe
  ]
})

export class SharedModule { }
