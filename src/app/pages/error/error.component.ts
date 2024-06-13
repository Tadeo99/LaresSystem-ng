import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getPathUrl } from 'src/shared/helpers/utils';
import { ERROR_ROUTE } from 'src/shared/helpers/constants';
import { IMessageRoute } from 'src/shared/models/common/interfaces/message-route.interface';

@Component({
  selector: 'mapfre-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  path: string
  data: IMessageRoute[] = ERROR_ROUTE;
  info: IMessageRoute;
  title: string;
  message: string;

  constructor(private router: Router) {
    this.path = getPathUrl(this.router.url);
  }

  ngOnInit() {
    let info = this.data.filter(o => o.path === this.path);
    this.title = info[0].data.title;
    this.message = info[0].data.message;
  }

}
