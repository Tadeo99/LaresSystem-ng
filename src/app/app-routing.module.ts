import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PATH_URL_DATA } from 'src/shared/helpers/constants';

import { ErrorComponent } from './pages/error/error.component';
import { MessageComponent } from './pages/message/message.component';

const routes: Routes = [
  {
    path: PATH_URL_DATA[0],
    loadChildren : () => import('@pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: PATH_URL_DATA[1],
    loadChildren : () => import('@pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: PATH_URL_DATA[2],
    loadChildren : () => import('@pages/read/read.module').then(m => m.ReadModule)
  },

  {
    path: PATH_URL_DATA[3],
    loadChildren : () => import('@pages/registro/registro.module').then(m => m.RegistroModule)
  },

  {
    path: PATH_URL_DATA[4],
    loadChildren : () => import('@pages/inicio/inicio.module').then(m => m.InicioModule)
  },

  {
    path: PATH_URL_DATA[5],
    loadChildren : () => import('@pages/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },

  {
    path: PATH_URL_DATA[6],
    component: MessageComponent
  },

  {
    path: PATH_URL_DATA[7],
    component: ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
