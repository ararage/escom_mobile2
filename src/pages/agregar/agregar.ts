import { Component } from '@angular/core';
import { 
  AlertController,    //Controlador de alertas
  LoadingController,  //Controlador de carga
  Loading,            //Mensajes de carga
  ViewController //Controlador de vista
} from 'ionic-angular';

//Formularios
import { 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
//Modelo
import {Auto} from '../../models/auto';
//Provider
import {AutosProvider} from '../../providers/autos/autos';

@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
  providers:[AutosProvider]
})
export class AgregarPage {
  //Objeto de carga
  loading: Loading; 
  //Titulo a mostrar del auto
  titulo:string
  //Formulario de auto
  public formAuto: FormGroup;
  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private viewCtr:ViewController,
    public formBuilder: FormBuilder,
    private autosProvider:AutosProvider
  ) {
    this.formAuto = formBuilder.group({
      marca:[null,
            Validators.compose(
            [ Validators.maxLength(15),
              Validators.pattern('[a-zA-Z0-9 \-_.áéóíúÁÉÍÓÚäöüßÄËÏÖÜñÑ]*'), 
              Validators.required])],
      modelo:[null,
            Validators.compose(
            [ Validators.maxLength(10),
              Validators.pattern('[a-zA-Z0-9 \-_.áéóíúÁÉÍÓÚäöüßÄËÏÖÜñÑ]*'), 
              Validators.required])],
      anio:[null,
            Validators.compose(
            [ Validators.maxLength(4),
              Validators.pattern('[0-9]*'), 
              Validators.required])],
      version:[null,
            Validators.compose(
            [ Validators.maxLength(10),
              Validators.pattern('[a-zA-Z0-9 \-_.áéóíúÁÉÍÓÚäöüßÄËÏÖÜñÑ]*'),
              Validators.required])]
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarPage');
  }

  //Se cierra el modal
  cerrarModal(){
    this.viewCtr.dismiss()
  }

  //Función de guardado
  guardar(){
    let auto = new Auto(
      this.formAuto.value.marca,
      this.formAuto.value.modelo,
      this.formAuto.value.anio,
      this.formAuto.value.version
    )
    this.showLoading()
    this.autosProvider.postAuto(auto)
    .subscribe(
      data=>{
        if(!data){
          this.errorInterno()
        }else{
          this.displayMessage("","Auto agregado satisfactoriamente")
          this.formAuto.reset()
          this.loading.dismissAll()
        }
      },
      error=>{
        this.errorInterno()
      }
    )
  }

  //función que se encarga de mostrar alerta de carga
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espera...',
      dismissOnPageChange: true
    });
    this.loading.present();
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
    alert.present();
  }

  //Función de error interno
  private errorInterno(){
    this.loading.dismissAll()
    this.displayMessage('Ocurrio un error','Error interno del sistema')
  }
}
