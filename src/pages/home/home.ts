import { Component } from '@angular/core';
import { 
  NavController,
  AlertController,    //Controlador de alertas
  LoadingController,  //Controlador de carga
  Loading,            //Mensajes de carga
  Platform,           //Conocer en que plataforma se corre la app
  ToastController     //Mostrar mensajes toast
} from 'ionic-angular';

//Diagnostico de nuestro Hardware
import { Diagnostic } from '@ionic-native/diagnostic';
//Geoloclaización
import { Geolocation  } from '@ionic-native/geolocation';
//Provider
import {GmapsProvider} from '../../providers/gmaps/gmaps'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[GmapsProvider]
})
export class HomePage {
  loading: Loading; //Objeto de carga
  //Marcardo del mapa y coordenadas
  m = <marker>{};
  //Aqui obtendremos la dirección obtenida
  direccion:string
  lat: number = 19.257927;
  lng: number = -99.173566;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private diagnostic: Diagnostic,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private toastCtrl:ToastController,
    private gmapsProvider:GmapsProvider) {
      this.m.lat = this.lat
      this.m.lng = this.lng
  }

  buscarUbicacion(){
    //Verificamos si estamos en un celular
    if(!this.platform.is("cordova")){
      this.mostrarToast("No es un celular")
      return;
    }
    //Mostrar mensaje
    this.showLoading()
    //Verificamos si esta activado el tracker del GPS
    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
        if(!isAvailable){
          this.loading.dismissAll()
          this.displayMessage('Activa tu GPS','Advertencia');
        }else{
          this.geolocation
          .getCurrentPosition()
          .then(
            (resp) => {
              this.lat = resp.coords.latitude
              this.lng = resp.coords.longitude
              /**Una vez encontradas las coordenadas tenemos que 
              mostrar el mapa y pintar el punto**/
              this.gmapsProvider.getAddressData(this.lat,this.lng)
              .subscribe(
                response=>{
                  try{
                    //Quitamos la carga
                    this.loading.dismissAll()
                    //Asignamos lat y lng al marcador
                    this.m.lat = this.lat
                    this.m.lng = this.lng
                    //Definimos el marcador como arrastable
                    this.m.draggable = true
                    //Seteamos en la variable direccion
                    //La dirección obtenida
                    this.direccion = response.results[0].formatted_address
                    this.m.label = this.direccion
                    //Mostramos mensaje
                    this.displayMessage(
                      'Fija el pin en la ubicación correcta',
                      'Ubicación encontrada'
                    )
                  }catch(error){
                    this.errorInterno()
                  }
                },
                error=>{
                  this.errorInterno()
                }
              )
            }
          ).catch((error) => {
            this.errorInterno()
          });
        }
      }
    ).catch((error) => {
      this.errorInterno()
    });
  }

  //Obtenemos las nuevas coordenadas
  markerDragEnd(m: marker, $event) {
    this.m.lat = $event.coords.lat
    this.m.lng = $event.coords.lng
    this.showLoading()
    this.gmapsProvider.getAddressData(this.m.lat,this.m.lng).subscribe(
      response=>{
        try{
          //Obtenemos la direccion de las nuevas coordenadas
          this.direccion = response.results[0].formatted_address
          this.m.label = this.direccion
          this.loading.dismissAll()
        }catch(error){
          this.errorInterno()
        }
      },
      error=>{
        this.errorInterno()
      }
    )
  }

  private errorInterno(){
    this.loading.dismissAll()
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

  //función que se encarga de mostrar mensajes Toast 
  private mostrarToast(texto:string){
    this.toastCtrl.create(
      {
        message:texto,
        duration:3000
      }).present();
  }

  //función que se encarga de mostrar alerta de carga
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espera...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
//Interface que define los atributos del marcador
interface marker {
	lat: number; //Latitud
	lng: number; //Longitud
	label?: string; //Label de la dirección
	draggable: boolean; //Bandera que indica si se puede tomar
}
