import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Deeplinks } from '@ionic-native/deeplinks';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Api, Common } from '../providers/providers';
import { OneSignal } from '@ionic-native/onesignal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    Api,
    Common,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Deeplinks,
    InAppBrowser,
    OneSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
