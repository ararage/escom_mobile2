import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
//Para el consumo de servicios REST
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry'
import {Observable} from 'rxjs/Observable';

import {Auto} from '../../models/auto';

@Injectable()
export class AutosProvider {
  public url:string

  constructor(public _http: Http) {
    this.url = 'http://localhost:7070/api';
  }

  getAutos():Observable<any>{
    return this._http.get(this.url+'/autos')
                .retry(3) //Intentara 3 veces obtener una respuesta
                .map(res=>res.json().data);
  }

  postAuto(auto:Auto){
    let params = JSON.stringify(auto)
    let headers = new Headers()
    headers.append(
      'Content-type','application/json'
    );
    return this._http.post(
      this.url+'/autos',
      params,
      {headers:headers}
    ).map(res=>res.json().data)
  }
}
