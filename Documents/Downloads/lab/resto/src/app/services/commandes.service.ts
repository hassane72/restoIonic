import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Commande} from '../models/commande';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Menu} from '../models/menu';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  URL = environment.URL;
  constructor(private httpClient: HttpClient) { }

  postCommande(commande: Commande): Observable<Commande> {
    return this.httpClient.post<Commande>(this.URL + '/commandes', commande).pipe();
  }

  getCommandeByUser(user: User): Observable<Commande> {
    return this.httpClient.get<Commande>(this.URL + '/commandes/?user.id=' + user.id).pipe();
  }

  getCommandeByMenu(menu: Menu): Observable<Commande> {
    return this.httpClient.get<Commande>(this.URL + '/commandes/?menu.id=' + menu.id).pipe();
  }
  getAllCommande(): Observable<Commande> {
    return this.httpClient.get<Commande>(this.URL + '/commandes?_sort=created_at:desc').pipe();
  }
}
