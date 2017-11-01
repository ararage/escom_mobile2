import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GmapsProvider {
  public url:string;
  private token:string

  constructor(public http: Http) {
    this.url = 'https://maps.googleapis.com/maps/api/geocode/json'
    this.token = 'AIzaSyCS7evVaiCMJEfzQcckSUpeNXVubLUX0D4'
  }
  getAddressData(lat:number,lng:number){
    var params = "?latlng="+lat+","+lng+"&key="+this.token
    return this.http.get(this.url+params)
      .map(res=>res.json())
  }
}
