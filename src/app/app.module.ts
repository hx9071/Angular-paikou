import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThsMapService } from './services/ths-map/ths-map.service';
import { AppAvailability } from '@ionic-native/app-availability/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    HttpClientJsonpModule,
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })],
  providers: [
    FileTransfer,
    File,
    ThsMapService,
    WebView,
    Camera,
    ImagePicker,
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileOpener,
    AppVersion,
    Device,
    Sim,
    Network,
    AndroidPermissions,
    Geolocation,
    Keyboard,
    InAppBrowser,
    AppAvailability,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
