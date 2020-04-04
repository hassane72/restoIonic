import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Menu} from '../models/menu';
import {Plat} from '../models/plat';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  URL = environment.URL;
  constructor(private httpClient: HttpClient) { }

  postMenu(menu: Menu): Observable<Menu> {
    return this.httpClient.post<Menu>(this.URL + '/menus', menu).pipe();
  }

  getMenus(offset = 0) {
    return this.httpClient.get<Menu[]>(this.URL + '/menus?_start=' + offset + '&_limit=10').pipe();
  }

  getMenu(id: number): Observable<Menu> {
    return this.httpClient.get<Menu>(this.URL + '/menus/' + id).pipe();
  }

  getMenuByDays() {
    return this.httpClient.get<Menu>(this.URL + '/menus').pipe();
  }

  deleteMenu(id: number) {
    return this.httpClient.delete(this.URL + '/menus/' + id).pipe();
  }

  updatePlat(id: number, menu: Menu): Observable <Menu> {
    return this.httpClient.put<Menu>(this.URL + '/menus/' + id, menu).pipe();
  }
}
