import { Injectable } from '@angular/core';
import { ConfigService } from '../config-service/config.service';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {

  constructor(
    public httpservice: HttpService,
    public configServicee: ConfigService,
  ) {
   }
  /**
   * 获取监督检查列表
   * @param params 请求参数
   * @param showloading 是否显示加载框
   * @param callback 请求后的回调函数
   */
  getSupervisionList(params, showloading, callback) {
    // this.configServicee.URL.GETSUPVERVISIONLIST是接口
    this.httpservice.get(this.configServicee.URL.GETSUPVERVISIONLIST, params, showloading, callback);
  }
}
