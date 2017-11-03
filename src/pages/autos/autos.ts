import { Component, OnInit } from '@angular/core';
import { 
  NavController,     //Control de navegacion
  NavParams,         //Control de Parametros
  AlertController    //Controlador de Alertas
} from 'ionic-angular';

//Operadores RXJS
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';

//Servicio de Autos
import { AutosProvider } from '../../providers/autos/autos';

@Component({
  selector: 'page-autos',
  templateUrl: 'autos.html',
  providers:[AutosProvider]
})
export class AutosPage implements OnInit{
  //Imagen a mostrar si no hay resultados
  imagen:any 
  //Array de autos a iterar
  public autos:any[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private autosProvider:AutosProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AutosPage');
  }

  ngOnInit(): void {
    this.getAutos()
  }

  getAutos(){
    this.autosProvider.getAutos().subscribe(
      result=>{
        if(!result){
          this.errorInterno()
        }else{
          let autos = Observable.of(result)
          autos.map(autos=> 
            autos.map(auto=>Object.assign({},auto,{img:"assets/imgs/"+auto.marca.toLowerCase()+".png"}))
          ).subscribe(autos=>this.autos = autos)
        }
      },
      error=>{
        this.errorInterno()
      }
    )
  }

  //Al entrar nuevamente a nuestra página hay que llamar nuevamente a autos
  ionViewDidEnter(){
    console.log("ionViewDidEnter()")
    this.getAutos()
  }

  private errorInterno(){
    this.displayMessage('Ocurrio un error','Error interno del sistema')
  }

  //función que se encarga de mostrar mensaje Alerta 
  private displayMessage(err:string,title:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: err,
      buttons: [
        "Ok"
      ]
    });
    alert.present(prompt);
  }
}
