import { Component, OnInit } from '@angular/core';
import { 
  NavController,     //Control de navegacion
  NavParams,         //Control de Parametros
  AlertController,   //Controlador de Alertas
  ModalController    //Controlador de Modals
} from 'ionic-angular';

//Operadores RXJS
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';

//Servicio de Autos
import { AutosProvider } from '../../providers/autos/autos';
//Pagina para registrar autos que será nuestro modal
import { AgregarPage } from '../agregar/agregar';

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
  //Bandera para mostrar mensaje sin autos
  sinAutos:boolean
  constructor(
    private modalCtr:ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private autosProvider:AutosProvider) {
      this.imagen = 'assets/imgs/sinauto.png';
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
            autos.map(auto=>Object.assign({},auto,{img:'assets/imgs/'+auto.marca.toLowerCase()+'.png'}))
          ).subscribe(autos=>this.autos = autos)
          //Si no hay autos mostramos un mensaje
          //mas agradable
          if(this.autos.length<1){
            this.sinAutos = true
          }else{
            this.sinAutos = false
          }
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

  public modalAgregar(){
    //Abrimos nuestro modal
    let createModal = this.modalCtr.create(AgregarPage)
    //Al cerrarse actualizamos hacemos la llamada nuevamente de todos los autos
    createModal.onDidDismiss(()=>{
      this.getAutos()
    })
    //Presentamos el modal
    createModal.present()
  }
}
