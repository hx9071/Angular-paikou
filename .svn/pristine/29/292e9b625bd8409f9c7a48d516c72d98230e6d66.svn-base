import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// 自动更新
import { AutoUpdateService } from './services/auto-update-service/auto-update.service';
import { Router } from '@angular/router';
import { PublicService } from './services/public-service/public.service';
import { ConfigService } from './services/config-service/config.service';
import { DeviceInfoService } from './services/device-info-service/device-info.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private autoUpdateService: AutoUpdateService,
    public router: Router,
    public publicService: PublicService,
    public configService: ConfigService,
    public deviceInfoService: DeviceInfoService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();  设置状态栏的头部为默认
      this.splashScreen.hide();
      this.checkVersion();
      this.registerBackButtonAction();

      this.deviceInfoService.startLocation().then((res) => {
        // this.configService.curLocation = res;
        this.configService.curLocation.lon = res.longitude;
        this.configService.curLocation.lat = res.latitude;
        this.configService.curLocation.addr = res.address;
      });
    });
  }

  /**
   * 监听返回键
   */
  registerBackButtonAction() {
    const login = '/login';
    let cangoBack = true;
    this.platform.backButton.subscribe(() => {
      console.log('this.router.url', this.router.url);
      if (this.router.url === login) {
        cangoBack = false;
      } else {
        const tabsCanGoBack = this.configService.tabsRoute.outlet.canGoBack();
        const tabsParentCanGoBack = this.configService.tabsRoute.outlet.parentOutlet.canGoBack();
        cangoBack = tabsCanGoBack || tabsParentCanGoBack;
      }
      console.log('cangoBack', cangoBack);
      this.publicService.androidBackButtonHandle(cangoBack);
    });
  }

  /**
   * 检查版本更新
   */
  private checkVersion(): void {

    const lastestVersionCheckLog = JSON.parse(localStorage.getItem('lastestVersionCheckLog')) || null;

    const today = new Date().toDateString();

    // 当天有检查更新时，不提示检查更新
    if (lastestVersionCheckLog && lastestVersionCheckLog.isChecked && lastestVersionCheckLog.date === today) {
      return;
    }

    const newVersionCheckLog = {
      date: today,
      isChecked: true
    };

    localStorage.setItem('lastestVersionCheckLog', JSON.stringify(newVersionCheckLog));

    // 检测版本号
    this.autoUpdateService.checkVersion();
  }
}
