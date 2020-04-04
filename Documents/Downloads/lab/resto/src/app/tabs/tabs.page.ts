import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  user: any = {};
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.user = JSON.parse(JSON.stringify(this.auth.getUser()));
  }
}
