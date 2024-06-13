import { Routes } from '@angular/router';
import { ReadComponent } from '@pages/read/read.component';
import { RegistroComponent } from '@pages/registro/registro.component';
import { LoginComponent } from '@pages/login/login.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { ChangePasswordComponent } from '@pages/change-password/change-password.component';

export const routes: Routes = [
    {
        path: 'read',
        component: ReadComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'confirmacion',
        component: ConfirmacionComponent
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent
    }
];
