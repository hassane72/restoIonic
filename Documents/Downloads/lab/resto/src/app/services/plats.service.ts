import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plat } from '../models/plat';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatsService {

  URL = environment.URL;
  constructor(private httpClient: HttpClient) { }

  postPlat(plat : Plat):Observable<Plat> {
    return this.httpClient.post<Plat>(this.URL + '/plats',plat).pipe();
    }
  getPlats(offset = 0): Observable<Plat[]> {
    return this.httpClient.get<Plat[]>(this.URL + '/plats?_start=' + offset + '&_limit=1').pipe();
  }
  getAllPlats(): Observable<Plat[]> {
    return this.httpClient.get<Plat[]>(this.URL + '/plats').pipe();
  }
    getPlat(id :number):Observable<Plat>
    {
    return this.httpClient.get<Plat>(this.URL+'/plats/'+id).pipe();
    }
  getPlatPromise(id :number)
  {
    return this.httpClient.get<Plat>(this.URL+'/plats/'+id).toPromise();
  }
    deletePlat(id : number)
    {
    return this.httpClient.delete(this.URL+'/plats/'+id).pipe();
    }
    updatePlat(id : number, plat : Plat) : Observable <Plat>
    {
    return this.httpClient.put<Plat>(this.URL+'/plats/'+id, plat).pipe();
    }
}
