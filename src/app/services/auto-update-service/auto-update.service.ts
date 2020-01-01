import {Injectable} from '@angular/core';

import {Platform} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

import {PublicService} from '.././public-service/public.service';
import {HttpService} from '.././http-service/http.service'; // 引入接口方法

@Injectable({
  providedIn: 'root'
})
export class AutoUpdateService {
  public updateInfo: any = '更新内容测试'; // 更新内容

  constructor(public platform: Platform,
              public publicService: PublicService,
              public httpService: HttpService,
              private appVersion: AppVersion,
              private browser: InAppBrowser,
              private alertController: AlertController) {

  }

  /**
   * 版本更新检测
   * nowVserion 当前版本信息
   * url  服务器地址
   * androidUrl android下载地址
   * iosUrl ios下载地址
   */
  checkVersion() {

    this.httpService.getAppVersion({}, false, res => {

      if (res && res.hasOwnProperty('APKNAME')) {

        const version = this.platform.is('ios') ? res.VER_ANDROID : res.VER_ANDROID;

        this.updateInfo = res.UPDATEINFO;
        this.upDateVerison(version, res.ANDROIDURL, res.APKNAME, res.IOSURL);

      } else {

        this.publicService.thsToast('更新失败');

      }

    });
  }

  /**
   * 弹框显示
   * @param preVersion 当前版本号
   * @param nowVserion 待更新版本号
   * @param updateInfo 更新内容
   * @param downUrl 下载地址
   * @param apkName apk名称
   */
  async presentAlert(preVersion, nowVserion, updateInfo, downUrl, apkName?) {

    const alert = await this.alertController.create({
      header: '发现新版本,是否更新?',
      message: '<div>当前版本号：' + preVersion + '</div><div>待更新版本号：' + nowVserion + '</div><div>更新内容：' + updateInfo + '</div>',
      buttons: [
        {
          text: '取消',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.browser.create(downUrl);
          }
        }
      ]
    });

    alert.present();
  }

  /**下载新版本
   * nowVserion  服务器版本信息
   * preVersion 本地版本信息
   * url  服务器地址
   * androidUrl android下载地址
   * iosUrl ios下载地址
   */
  upDateVerison(nowVserion, androidUrl, apkName, iosUrl?) {

    this.platform.ready().then(() => {

      if (this.platform.is('ios')) {

        this.appVersion.getVersionNumber().then(res => {

          if (this.handleVersion(res) < this.handleVersion(nowVserion)) {
            this.presentAlert(res, nowVserion, this.updateInfo.replace(/、/g, '<br />'), iosUrl);
          }

        });

      } else if (this.platform.is('android')) {

        this.appVersion.getVersionNumber().then(res => {

          if (this.handleVersion(res) < this.handleVersion(nowVserion)) {
            this.publicService.downApp(
              apkName,
              '<div class="updateMessage">更新内容：</div><div class="updateMessage">' + this.updateInfo.replace(/、/g, '<br />') + '</div>',
              null,
              androidUrl,
              'update'
            );
          }

        });
      }
    });
  }

  /**
   * 处理版本号
   * @param num 版本号
   */
  handleVersion(num) {
    if (num) {
      return num.split('.').join('');
    }
  }

}
