import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConfigService } from '../config-service/config.service';
import { DeviceInfoService } from '../device-info-service/device-info.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public sLocation: any = {
    sLat: this.configService.curLocation.lat,
    sLon: this.configService.curLocation.lon,
    sName: '我的位置'
  }; // 起点位置
  public dLocation: any = {
    dLat: '',
    dLon: '',
    dName: ''
  }; // 终点位置
  constructor(
    public http: HttpClient,
    public alertController: AlertController,
    public alertCtrl: AlertController,
    private platform: Platform,
    public thsLocationProvider: DeviceInfoService,
    private appAvailability: AppAvailability,
    private configService: ConfigService,
    private iab: InAppBrowser) {

    // this.sLocation.sLat = this.configProvider.latitude;
    // this.sLocation.sLon = this.configProvider.longitude;

  }

  /**
   * 开启导航操作
   * @param dLoc 导航终点位置信息
   */
  beginNav(dLoc) {
    this.dLocation = dLoc;
    this.checkApp();
  }

  /**
   * 检查设备是否安装高德地图或百度地图
   */
  checkApp() {
    let gaoDeapp;
    let baiDuapp;

    if (this.platform.is('ios')) {
      gaoDeapp = 'iosamap://'; // 高德地图
      baiDuapp = 'baidumap://'; // 百度地图
    } else if (this.platform.is('android')) {
      gaoDeapp = 'com.autonavi.minimap';
      baiDuapp = 'com.baidu.BaiduMap';
    }

    // 检测是否安装地图
    this.appAvailability.check(gaoDeapp).then(
      (yes: boolean) => {
        //  alert('即将打开高德地图！');
        // 打开高德地图
        this.openApp('gaode');
      },
      (no: boolean) => {
        // 检测是否安装百度地图
        this.appAvailability.check(baiDuapp).then(
          (yes: boolean) => {
            //     alert('即将打开百度地图！');
            // 打开百度地图
            this.openApp('baidu');
          },
          () => {
            //   alert('都没有 要去下载')
            // 都没有安装则引导用户下载
            this.chooseDownLoadApp();
          }
        );
      }
    );
  }


  /**
   * 下载高德或百度地图
   */
  async chooseDownLoadApp() {
    const alert = await this.alertController.create({
      cssClass: 'download-alert',
      inputs: [
        {
          name: 'gaode',
          type: 'radio',
          label: '高德地图',
          value: 'gaode',
          checked: true
        },
        {
          name: 'baidu',
          type: 'radio',
          label: '百度地图',
          value: 'baidu'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '确定',
          handler: (data) => {
            this.goTodownLoadApp(data);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * 前往下载高德地图或者百度地图
   * @param data gaode高德地图 baidu百度地图
   */
  goTodownLoadApp(data) {
    let appUrl;
    if (this.platform.is('android')) {
      if (data === 'gaode') {
        appUrl = 'http://daohang.amap.com/index.php?';
      } else if (data === 'baidu') {
        appUrl = 'http://map.baidu.com/zt/qudao/newfengchao/1012337a/html/slide.html';
      }
      this.iab.create(appUrl, '_system');
    } else if (this.platform.is('ios')) {
      if (data === 'gaode') {
        // appUrl = 'http://wap.amap.com/index.html?';
        // tslint:disable-next-line:max-line-length
        appUrl = 'https://itunes.apple.com/cn/app/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E7%B2%BE%E5%87%86%E5%AF%BC%E8%88%AA-%E5%87%BA%E8%A1%8C%E5%BF%85%E5%A4%87/id461703208?mt=8';
      } else if (data === 'baidu') {
        // appUrl = 'http://ecmb.bdimg.com/tam-ogel/24885ef6-329d-4aec-b9f3-1d51fd750159.html';
        appUrl = 'https://itunes.apple.com/app/apple-store/id452186370?&mt=8';
      }
      this.iab.create(appUrl);
    }

  }

  /**
   * 打开第三方app
   * @param data gaode 高德地图 baidu百度地图
   */
  openApp(data) {
    let appPackage;
    let appUri;
    let sLonGcj;
    let sLatGcj;
    let dLonGcj;
    let dLatGcj;
    // 当前位置是WGS-84坐标系
    // 高德地图上需要将其他坐标系的经纬度转换为GCJ-02坐标系的经纬度
    sLonGcj = this.thsLocationProvider.gcj_encrypt(this.sLocation.sLat, this.sLocation.sLon).lon;
    sLatGcj = this.thsLocationProvider.gcj_encrypt(this.sLocation.sLat, this.sLocation.sLon).lat;
    // dLonGcj = this.thsLocationProvider.bd_decrypt(this.dLocation.dLat, this.dLocation.dLon).lon;
    // dLatGcj = this.thsLocationProvider.bd_decrypt(this.dLocation.dLat, this.dLocation.dLon).lat;
    dLonGcj = this.dLocation.dlon;
    dLatGcj = this.dLocation.dlat;

    if (this.platform.is('android')) {
      if (data === 'gaode') {
        appPackage = 'com.autonavi.minimap';
        appUri = 'amapuri://route/plan/?&slat=' + sLatGcj + '&slon=' + sLonGcj + '&sname=我的位置&dlat=' +
          this.dLocation.dLat + '&dlon=' + this.dLocation.dLon + '&dname=' + this.dLocation.dName + '&dev=0&t=0'; // 选择路径规划然后导航
      } else {
        appPackage = 'com.baidu.BaiduMap';
        if (!this.dLocation.dLat || this.dLocation.dLat === '--') {
          appUri = 'baidumap://map/direction?origin=我的位置&destination=' + this.dLocation.dName + '&coord_type=gcj02&mode=driving';
        } else {
          appUri = 'baidumap://map/direction?origin=我的位置&destination=name:' + this.dLocation.dName + '|latlng:' +
            this.dLocation.dLat + ',' + this.dLocation.dLon + '|addr:' + this.dLocation.dName + '&coord_type=gcj02&mode=driving';
        }
      }

      const sApp = (window as any).startApp.set({  // 跳转对应APP
        action: 'ACTION_VIEW',
        category: 'CATEGORY_DEFAULT',
        type: 'text/css',
        package: appPackage,
        uri: appUri,
        flags: ['FLAG_ACTIVITY_CLEAR_TOP', 'FLAG_ACTIVITY_CLEAR_TASK'],
        intentstart: 'startActivity',
      }, { /* extras */
        EXTRA_STREAM: 'extraValue1',
        extraKey2: 'extraValue2'
      });
      sApp.start(() => { // 跳转成功
        // alert('OK');
      }, (error) => { // 失败
        // alert(error);
      });
    } else if (this.platform.is('ios')) {
      if (data === 'gaode') {
        appUri = 'iosamap://path?sourceApplication=applicationName&sid=BGVIS1&slat=&slon=&sname=&did=BGVIS2&dlat='
          + dLatGcj + '&dlon=' + dLonGcj + '&dname=' + encodeURI(this.dLocation.dName) + '&dev=0&t=0'; // 选择路径规划然后导航
      } else {
        appUri = 'baidumap://map/direction?origin=' + sLatGcj + ',' + sLonGcj + '&destination=' +
          dLatGcj + ',' + dLonGcj + '&coord_type=gcj02&mode=driving&src=ios.baidu.openAPIdemo';
      }
      const sApp = (window as any).startApp.set(appUri);
      sApp.start(() => {
        //  alert('OK');
      }, (error) => {
        // alert(error);
      });
    }
  }
}
