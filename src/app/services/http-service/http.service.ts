import { Injectable } from '@angular/core';
import { PublicService } from '../public-service/public.service';
import { ConfigService } from '../config-service/config.service';
import { LoadingController, ToastController } from '@ionic/angular'; // 引入loading
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; //  引入请求方式

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public toast: any = null;
  constructor(
    public toastCtrl: ToastController,
    public publicService: PublicService,
    public loadingController: LoadingController,
    public httpclient: HttpClient,
    public configService: ConfigService) { }


  /**
   * 配置GET请求方式
   * @param  url 请求地址(必传)
   * @param  params 参数(必传)
   * @param  showloading 是否显示Loading框(必传)boolean值
   * @param  callback 回调函数(必传)
   */
  async get(url, params, showloading, callback) {
    let loader = null;
    if (showloading) {
      loader = await this.presentLoading('');
    }

    this.httpclient.get(url, { responseType: 'json', params: this.httpParams(params) })
      .subscribe(
        res => {
          if (showloading) {
            this.hideLoading(loader);
          }
          if (res) {
            callback(res);
          } else {
            callback('error');
          }
        },
        err => {
          if (showloading) {
            this.hideLoading(loader);
          }
          callback('error');
          console.log('请求失败');
        }
      );
  }
  /**
   * 参数处理
   * @param param 调用函数传过来的参数，键值对形式
   */
  httpParams(param: Map<any, any>) {
    let ret = new HttpParams();
    if (param) {
      for (const key in param) {
        if (param[key]) {
          ret = ret.set(key, param[key]);
        } else {
          ret = ret.set(key, param[key]);
        }
      }
    }
    return ret;
  }

  /**
   * 登陆
   * @param params 1
   * @param showloading 2
   * @param callback 2
   */
  /**
   * showloading服务
   * @param template 展示内容(选传)
   */
  async presentLoading(template?) {
    const loader = await this.loadingController.create({
      spinner: 'circles'
    });
    await loader.present();
    return loader;
  }

  /**
   * 配置GET请求方式
   * @param  url 请求地址(必传)
   * @param  params 参数(必传)
   * @param  showloading 是否显示Loading框(必传)boolean值
   * @param  callback 回调函数(必传)
   */


  login(params, showloading, callback) {
    return this.publicService.get(this.configService.loginInterface, params, showloading, callback);
  }

  /**
   * 获取app版本信息
   * @param params 调用方法传过来的参数，根据城市代码查询进行获取
   * @param flag 是否显示数据加载,false或不传参为显示，true不显示
   * @param callback 回调函数
   */
  getAppVersion(params, showloading, callback) {
    return this.publicService.get(this.configService.getVersionInfoInterface, {}, showloading, callback);
  }
  /**
   * 获取排口的列表的信息
   */
  getTrackReacord(params, showloading, callback) {
    let api;
    // api = 'http://223.223.179.204:9090/output/api/inter/outputinter/getoutputArchives.vm';
    api = this.configService.PutletReacord;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   * 根据区域获取城市排口数量
   */
  getTrackRegionNum(params, showloading, callback) {
    let api;
    // api = 'http://223.223.179.204:9090/output/api/inter/outputinter/getRegionOutput.vm';
    api = this.configService.regionOutput;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   * 获取湖泊的信息
   */
  getlakeReacord(params, showloading, callback) {
    let api;
    // api = 'http://223.223.179.204:9090/output/api/inter/outputinter/getLakeAndOutput.vm';
    api = this.configService.getLakeAndOutputInterface;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   * 获取排口的详细信息
   */
  getPutletDetail(params, showloading, callback) {
    let api;
    // api = 'http://223.223.179.204:9090/output/api/inter/outputinter/getoutputArchivesInfo.vm';
    api = this.configService.PutletDetail;
    return this.publicService.get(api, params, showloading, callback);
  }

  /**
   * 获取lakename
   */
  getLakeName(params, showloading, callback) {
    let api;
    api = this.configService.getLakeAndOutputInterface;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   * 获取入湖排口水质监测数据列表
   */
  getWaterMon(params, showloading, callback) {
    let api;
    api = this.configService.WaterMon;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   *  获取字典
   */
  getOption(params, showloading, callback) {
    let api;
    api = this.configService.Option;
    return this.publicService.get(api, params, showloading, callback);
  }
  /**
   * toast提示框
   * @param txt 提示文字
   * @param position 位置
   */
  async thsToast(txt: string, position?) {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
    this.toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000,
      position: position ? position : 'bottom',
    });
    this.toast.present();
  }

  /**
   * 关闭loading
   * @param  loader 创建的loading对象
   */
  hideLoading(loader) {
    loader.dismiss();
  }

  /**
   * jsonp
   */
  async getJsonp(params, showloading, callback) {
    console.log(params, '请求的参数');
    const url = this.configService.baiduWebUrL + '?&ak=' +
      this.configService.baiduWebAk + '&location=' + params.lat
      + ',' + params.lng + '&output=json&coordtype=gcj02ll' + '&extensions_town=true';

    console.log('URL', url);

    this.httpclient.jsonp(url, 'callback').subscribe(res => {
      console.log('in getJsonp: success res', res);
      callback(res);
      // alert(JSON.stringify(res) );
    });
  }
}
