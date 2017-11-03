import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { AutosPage } from '../pages/autos/autos';
import { TabsPage } from '../pages/tabs/tabs';
import { AgregarPage } from '../pages/agregar/agregar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Mapas
import { AgmCoreModule } from '@agm/core';

//Plugins
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

//Providers
import { GmapsProvider } from '../providers/gmaps/gmaps';
import { AutosProvider } from '../providers/autos/autos';

//Pipes
import { TituloPipe } from '../pipes/titulo/titulo';
 
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AutosPage,
    AgregarPage,
    TituloPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCS7evVaiCMJEfzQcckSUpeNXVubLUX0D4'
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AutosPage,
    AgregarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Diagnostic,
    GmapsProvider,
    AutosProvider
  ]
})
export class AppModule {}
