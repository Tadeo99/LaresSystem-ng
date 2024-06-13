import { Component, OnInit } from '@angular/core';
import { getPathUrl } from 'src/shared/helpers/utils';
import { Router } from '@angular/router';
import { IMessageRoute } from 'src/shared/models/common/interfaces/message-route.interface';
import { MESSAGE_ROUTE } from 'src/shared/helpers/constants';

@Component({
  selector: 'mapfre-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  path: string
  data: IMessageRoute[] = MESSAGE_ROUTE;
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
