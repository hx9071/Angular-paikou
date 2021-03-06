import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, Events } from '@ionic/angular';
import { HttpService } from '../../services/http-service/http.service';

// 加密
import * as CryptoJS from 'crypto-js';

// 设备
import { Device } from '@ionic-native/device/ngx';

// app版本
import { AppVersion } from '@ionic-native/app-version/ngx';

// SIM卡
import { Sim } from '@ionic-native/sim/ngx';

// 网络
import { Network } from '@ionic-native/network/ngx';

// android权限
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

// 地理位置
import { Geolocation } from '@ionic-native/geolocation/ngx';

// 服务
import { ConfigService } from '../config-service/config.service';
import { PublicService } from '../public-service/public.service';

declare let navigator: any;
declare let KeychainUUID;

/*
 使用说明：1需要安装的插件请见最下面.
*/

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  // 上传设备信息的地址
  deviceInfoUrl = 'http://182.48.115.108:8887/thsapp/app/upAppInfo.vm';

  // 上传地址信息的地址
  locationUrl = 'http://182.48.115.108:8887/thsapp/app/upLocInfo.vm';

  public PI = 3.1415926535897932384626;

  public deviceInfo: any = {};

  public locData = {
    latitude: 30.601622,
    longitude: 114.27196,
    city: '', // 城市 成都市
    district: '', // 区 武侯区
    address: '', // 地址
    locationdescribe: '', // 就近值
    province: '', // 省份 四川省
    street: '', // 街道
  };

  public xPi = 3.14159265358979324 * 3000.0 / 180.0;
  constructor(
    private device: Device,
    private appVersion: AppVersion,
    public events: Events,
    private sim: Sim,
    private network: Network,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private platform: Platform,
    public publicService: PublicService,
    public configService: ConfigService) {

    this.deviceInfo = {
      appVer: '', // 应用版本
      serial: '', // 设备串号
      deviceId: '', // 设备串号
      user: '', // 用户登录名
      deviceMode: this.device.model || '', // 型号
      sysVer: this.device.version || '', // 版本号
      run: this.device.platform || '', // 平台
      packageName: '', // 包名
      bundleId: '', // 应用包名
      loginId: '', // 本次登录系统结果ID
      Id: '', // 用于记录登录时间与退出时间
      carrierName: '', // 服务提供者名称
      phoneNumber: '', // 电话号码
      deviceId2: '', // 设备号
      networkType: this.network.type || '', // 网络类型
      simSerialNumber: '', // SIM卡序列号
      manufacturer: this.device.manufacturer, // 设备制造商
      mnc: '', // SIM卡提供商的MNC（移动网络代码）
      mcc: '', // SIM卡提供商的MCC（移动国家代码）
      resolutionRatio: '', // 分辨率
      size: '', // 尺寸
      appId: 'h15657470235134' // appid(应用平台获取，这变量为必须变量，并且为每个app自己的id);
    };

  }

  /**
   * 发送集成信息
   *
   */
  public sendDeviceInfo(user: string = '') {

    console.log('in sendDevicesInfo: user', user);

    if (!this.platform.is('android') && !this.platform.is('ios')) {
      console.log('in sendDeviceInfo: pc端无法上传设备信息');
      return;
    }

    // 是虚拟机
    if (this.device.isVirtual) {
      return;
    }

    // 没有appid
    if (!this.deviceInfo.appId) {
      return;
    }

    this.deviceInfo.loginId = user;
    this.deviceInfo.user = user;

    return this.requestPermissions();

  }

  /**
   * 请求开启权限获取手机信息
   */
  private requestPermissions() {

    console.log('in requestPermissions');

    let promise;

    promise = new Promise((resolve, reject) => {

      if (this.platform.is('android')) {

        // 获取权限
        this.androidPermissions.requestPermissions(
          [this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
          this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
          this.androidPermissions.PERMISSION.READ_PHONE_STATE]).then(
            (data) => {

              // 获取手机信息
              this.getPhoneInfo();

              // // 获取定位并上传位置信息
              // this.getLocation()

              //   .then(res => {

              //     if (res) {
              //       resolve(true);
              //     }

              //     reject('移动设备定位失败');

              //   });

            });

      } else if (this.platform.is('ios')) {

        // 获取手机信息
        this.getPhoneInfo();

        // // 获取定位并上传位置信息
        // this.getLocation()

        //   .then(res => {

        //     if (res) {
        //       resolve(true);
        //     }

        //     reject('移动设备定位失败');

        //   });

      }

    });

    return promise;

  }

  /**
   * 获取手机信息
   */
  private async getPhoneInfo() {

    // console.log('in getPhoneInfo');

    // 获取尺寸
    await this.getSizeInfo();

    // 获取sim卡信息
    await this.getSimInfo();

    // 获取设备信息
    await this.getDeviceInfo();

  }

  /**
   * 获取尺寸
   */
  private getSizeInfo() {

    // console.log('in getSizeInfo');

    window['plugins'].screensize.get((result) => {

      // 获取分辨率
      this.deviceInfo.resolutionRatio = result.height + '*' + result.width;

      // 获取尺寸（diameter为安卓返回的尺寸，scale为ios返回的尺寸）
      this.deviceInfo.size = String(result.diameter || result.scale);

    }, (error) => {

    });

  }

  /**
   * 获取sim卡信息
   */
  private getSimInfo() {

    // console.log('in getSimInfo');

    window['plugins'].sim.getSimInfo((info) => {

      // 获取服务提供者名称
      this.deviceInfo.carrierName = info.carrierName || '';

      // 获取mcc号
      this.deviceInfo.mcc = String(info.mcc) || '';

      // 获取mnc号
      this.deviceInfo.mnc = String(info.mnc) || '';

      if (info.cards && info.cards[0].phoneNumber) {

        this.deviceInfo.phoneNumber = info.cards[0].phoneNumber;

      } else if (info.phoneNumber) {

        // 获取电话号码
        this.deviceInfo.phoneNumber = info.phoneNumber;

      } else {

        this.deviceInfo.phoneNumber = '';

      }

      // 获取SIM卡序列号
      this.deviceInfo.simSerialNumber = info.cards ? info.cards[0].simSerialNumber : '';

      // 获取设备号
      this.deviceInfo.deviceId2 = info.deviceId || '';

    }, (error) => {

    });
  }

  /**
   * 获取设备信息
   */
  private async getDeviceInfo() {

    // console.log('in getDeviceInfo');

    let paramMap: any = {};

    if (this.platform.is('android')) {

      // 安卓返回的设备串号
      this.deviceInfo.serial = this.device.serial || '';
      this.deviceInfo.deviceId = this.device.serial || '';

    } else if (this.platform.is('ios')) {

      // key值统一
      const args = {
        'key ': 'solution'
      };

      // 获取ios返回的设备串号
      KeychainUUID.getDeviceID((id) => {
        console.log('成功');
        this.deviceInfo.serial = id;
        this.deviceInfo.deviceId = id;
      }, (err) => {
        console.log(err);
      }, args);
    }

    this.deviceInfo.user = this.deviceInfo.user ? this.deviceInfo.user : this.deviceInfo.serial;

    // 获取版本号，包名等信息
    await this.appVersion.getVersionNumber().then(version => {
      this.deviceInfo.appVer = version;
    });

    await this.appVersion.getPackageName().then(data => {

      this.deviceInfo.bundleId = data;
      this.deviceInfo.packageName = data;

    });

    // 加密对象值
    paramMap = Object.keys(this.deviceInfo)

      .reduce((prev, next) => {

        return Object.assign({}, prev, {
          [next]: this.encryptParam(this.deviceInfo[next]) || ''
        });

      }, {});

    await this.postDeviceInfo({
      params: paramMap
    });

    // console.log('in getDeviceInfo :deviceInfo:', this.deviceInfo);
  }

  /**
   * 生成表的主键id
   */
  public getUuid() {
    const s = [];
    const hexDigits = '0123456789ABCDEF';
    for (let i = 0; i < 32; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    const uuid = s.join('');
    return uuid;
  }

  /**
   * 上传位置信息
   * @param position 位置信息
   */
  public sendLocationInfo(position) {

    console.log('in sendLocationInfo');

    const paramsRes = {
      lat: position.lat || position.latitude,
      lon: position.lon || position.longitude,
      userCode: this.deviceInfo.loginId,
      loginId: this.deviceInfo.loginId,
      deviceId: this.deviceInfo.serial,
      id: this.deviceInfo.Id
    };

    this.publicService.post(this.locationUrl, paramsRes, false, res => {

      if (res && res.ret === 1) {
        console.log('公共平台位置信息上传成功');
      } else {
        console.log('公共平台位置信息上传失败');
      }

    });

  }

  /**
   * 上传设备信息
   * @param onf 设备信息
   */
  public postDeviceInfo(onf: any = {}) {

    const { params } = onf;

    console.log('in postDeviceInfo : params', params);

    // 上传信息到服务器
    this.publicService.post(this.deviceInfoUrl, params, false, res => {

      if (res && res.ret === 1) {
        console.log('in postDeviceInfo: 设备信息发送成功');

        // 登录成功后的id，用于位置信息登录
        this.deviceInfo.loginId = res.loginId;
        this.deviceInfo.Id = res.Id;

        this.startLocation().then(resp => {
          this.sendLocationInfo(resp);
        });

      } else {
        console.log('设备信息发送失败', res);
      }
    });

  }

  /**
   * AES加密方法
   * @param word 待加密字符串
   * @returns string 加密后的字符串
   */
  public encryptParam(word) {
    if (!word || word === '') {
      return undefined;
    }
    const key = CryptoJS.enc.Latin1.parse('solu20180228tion');
    const iv = CryptoJS.enc.Latin1.parse('solu20180228tion');
    return CryptoJS.AES.encrypt(word, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString();
  }

  /**
   * md5加密方法
   * @param word 待加密字符串
   * @returns string 加密后的字符串
   */
  public md5EncryptParam(word) {

    if (!word) {
      return undefined;
    }

    return CryptoJS.MD5(word).toString();
  }

  /**
   * 获取定位
   */
  public getLocation() {

    console.log('in getLocation');

    this.events.publish('nowLocal');

    let promise;

    promise = new Promise((resolve, reject) => {

      if (this.platform.is('android')) {

        navigator.baidulocation.get(res => {
          console.log('res', res);
          const position = {
            lat: res.latitude,
            lon: res.longitude
          };

          if (position.lat !== 5e-324 && position.lon !== 5e-324) {
            const wgsLoc = this.gcj_decrypt_exact(position.lat, position.lon);
            this.locData.latitude = wgsLoc.lat;
            this.locData.longitude = wgsLoc.lon;
            this.locData.city = res.city;
            this.locData.district = res.district;
            this.locData.address = res.addr;
            this.locData.province = res.province;
            this.locData.street = res.street;
            this.locData.locationdescribe = res.locationdescribe;

            this.sendLocationInfo(position); // 上传定位信息

            localStorage.setItem('userLocation', JSON.stringify(res));

            resolve(true);

          } else {

            console.log('安卓设备定位失败');
            localStorage.setItem('userLocation', '');

          }
        }, error => {
          console.log('安卓设备定位失败：error', error);
          localStorage.setItem('userLocation', '');
        });

      } else if (this.platform.is('ios')) {

        const posOptions = { enableHighAccuracy: true };

        this.geolocation.getCurrentPosition(posOptions).then(resp => {

          const position = this.gcj_encrypt(resp.coords.latitude, resp.coords.longitude);

          if (position.lat !== 5e-324 && position.lon !== 5e-324) {

            resp.coords.latitude = position.lat;
            resp.coords.longitude = position.lon;

            localStorage.setItem('userLocation', JSON.stringify(resp.coords));

            this.sendLocationInfo(position); // 上传定位信息

            resolve(true);
          } else {
            console.log('IOS设备定位失败');
            localStorage.setItem('userLocation', '');
          }

        }, error => {
          console.log('IOS设备定位失败：error', error);
          localStorage.setItem('userLocation', '');
        });
      }
    });

    return promise;

  }


  /**
   *  获取当前定位
   */
  public startLocation(): Promise<any> {
    if (this.platform.is('android')) {
      return new Promise(resolve => {
        navigator.baidulocation.get((message) => {
          const lat = message.latitude;
          const lng = message.longitude;
          if (lat !== 5e-324 && lng !== 5e-324) {
            const wgsLoc = this.gcj_decrypt_exact(lat, lng);
            this.locData.latitude = wgsLoc.lat;
            this.locData.longitude = wgsLoc.lon;
            this.locData.city = message.city;
            this.locData.district = message.district;
            this.locData.address = message.addr;
            this.locData.province = message.province;
            this.locData.street = message.street;
            this.locData.locationdescribe = message.locationdescribe;
          }
          resolve(this.locData);
          console.log(this.locData, '当前定位');
          // console.log(message, 'message');
        });

      });
    } else if (this.platform.is('ios')) {
      return new Promise(resolve => {
        const posOptions = { enableHighAccuracy: true };
        this.geolocation.getCurrentPosition(posOptions).then((resp) => {
          const lat = resp.coords.latitude;
          const lng = resp.coords.longitude;
          if (lat !== 5e-324 && lng !== 5e-324) {
            this.locData.latitude = lat;
            this.locData.longitude = lng;
          }
          resolve(this.locData);
        }).catch((error) => {

        });
      });
    }
  }

  // BD-09 to GCJ-02
  bd_decrypt(bdLat, bdLon) {
    const x = bdLon - 0.0065, y = bdLat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.xPi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.xPi);
    const gcjLon = z * Math.cos(theta);
    const gcjLat = z * Math.sin(theta);
    return { lat: gcjLat, lon: gcjLon };
  }

  /**
   * WGS-84 to GCJ-02
   * @param wgsLat 经度
   * @param wgsLon 纬度
   * @returns object {lat: any; lon: any}
   */

  gcj_encrypt(wgsLat, wgsLon) {

    if (this.outOfChina(wgsLat, wgsLon)) {
      return { lat: wgsLat, lon: wgsLon };
    }

    const d = this.delta(wgsLat, wgsLon);
    return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
  }

  // GCJ-02 to WGS-84
  gcj_decrypt(gcjLat, gcjLon) {
    if (this.outOfChina(gcjLat, gcjLon)) {
      return { lat: gcjLat, lon: gcjLon };
    }

    const d = this.delta(gcjLat, gcjLon);
    return { lat: gcjLat - d.lat, lon: gcjLon - d.lon };
  }


  // GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact(gcjLat, gcjLon) {
    const initDelta = 0.01;
    const threshold = 0.000000001;
    let dLat = initDelta, dLon = initDelta;
    let mLat = gcjLat - dLat, mLon = gcjLon - dLon;
    let pLat = gcjLat + dLat, pLon = gcjLon + dLon;
    let wgsLat, wgsLon, i = 0;
    while (1) {
      wgsLat = (mLat + pLat) / 2;
      wgsLon = (mLon + pLon) / 2;
      const tmp = this.gcj_encrypt(wgsLat, wgsLon);
      dLat = tmp.lat - gcjLat;
      dLon = tmp.lon - gcjLon;
      if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) {
        break;
      }
      if (dLat > 0) {
        pLat = wgsLat;
      } else {
        mLat = wgsLat;
      }
      if (dLon > 0) {
        pLon = wgsLon;
      } else {
        mLon = wgsLon;
      }
      if (++i > 10000) {
        break;
      }
    }

    return { lat: wgsLat, lon: wgsLon };
    // const a = 6378245.0;
    // const ee = 0.00669342162296594323;

    // const lng = 121.7219;
    // const lat = 39.4141;
    // let dlat = this.transformlat(lng - 105.0, lat - 35.0);
    // let dlng = this.transformlng(lng - 105.0, lat - 35.0);
    // const radlat = lat / 180.0 * this.PI;
    // let magic = Math.sin(radlat);
    // magic = 1 - ee * magic * magic;
    // const sqrtmagic = Math.sqrt(magic);
    // dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * this.PI);
    // dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * this.PI);
    // const mglat = lat + dlat;
    // const mglng = lng + dlng;
    // return { lat: mglat, lon: mglng };
  }

  transformlat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  transformlng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
    return ret;
  }

  outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  }

  /**
   * 定位数据转换逻辑
   */
  delta(lat, lon) {

    // a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    const a = 6378245.0;

    // ee: 椭球的偏心率。
    const ee = 0.00669342162296594323;
    let dLat = this.transformLat(lon - 105.0, lat - 35.0);
    let dLon = this.transformLon(lon - 105.0, lat - 35.0);

    const radLat = lat / 180.0 * this.PI;

    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;

    const sqrtMagic = Math.sqrt(magic);

    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
    return { lat: dLat, lon: dLon };
  }

  transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
    return ret;
  }

}

// 需要安装以下包
// ionic cordova plugin add cordova-plugin-device
// npm install @ionic-native/device

// ionic cordova plugin add cordova-plugin-app-version
// npm install @ionic-native/app-version

// npm install crypto-js
// npm install @types/crypto-js --save-dev

// ionic cordova plugin add cordova-plugin-sim
// npm install @ionic-native/sim

// ionic cordova plugin add cordova-plugin-network-information
// npm install @ionic-native/network

// ionic cordova plugin add cordova-plugin-android-permissions
// npm install @ionic-native/android-permissions

// ionic cordova plugin add cordova-plugin-geolocation
// npm install @ionic-native/geolocation

// ionic cordova plugin add cordova-plugin-screensize

// ios需要单独安装
// npm install cordova-plugin-keychain-uuid
