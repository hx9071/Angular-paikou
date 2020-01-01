import { Injectable } from '@angular/core';
import { ConfigService } from '../config-service/config.service';
import { PublicService } from '../public-service/public.service';
import { HttpService } from '../http-service/http.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    public configservice: ConfigService,
    public publicService: PublicService,
    public httpservice: HttpService
  ) { }
  /**
   * 搜索数据的请求
   * @param params   请求参数 得到后台的接口
   * @param showloading  是否显示数据加载,false或不传参为显示，true不显示
   * @param callback  使用回调函数
   */
  getOutLetSearchData(params, showloading, callback) {
    return this.publicService.get(this.configservice.getOutletSearchData, params, showloading, callback);
  }
  /**
   * 判断是否为空
   * @param obj 数字
   */
  isEmpty( obj) {
    if (typeof obj === 'undefined' || obj == null || obj === '') {
      // 判断为空值时 返回 false
        return false;
    } else {
        return true;
    }
}
/**
 * 判断是几位小数
 * @param index 精确数
 * @param obj 传入的值
 */
isFloat(index, obj) {
  let rexp;
  let num;
  // obj = Number(obj);
  console.log('输入的数：', obj );
  if ( this.isEmpty(obj) ) {
    switch (index) {
      // 判断是都精确到后二位
      case 2:
        rexp = /^[0-9]+.[0-9][0-9]$/;
        num = obj.match(rexp);
        if (num !== obj) {
          return false;
        } else {
          return true;
        }
      // 判断是都精确到后三位
      case 3:
      // 是浮点数返回 true
        rexp = /^[0-9]+.[0-9][0-9][0-9]$/;
        num = obj.match(rexp);
        if ( !this.isEmpty(num) ) {
          console.log('这个不是三位小数');
          return false;
        } else {
          return true ;
        }
      default:
        break;
    }
  }
}
  /**
   * 判断是否为整数
   * @param obj 获取的数据
   */
  isInt(obj) {
    if ( Number.isInteger(Number(obj)) && this.isEmpty(obj)) {
      console.log('这个是整数' , Number(obj));
      return true;
      // 整数返回true
    } else {
      console.log('这个不是是整数' , Number(obj));
      return false;
    }
  }

  /**
   *  将路径切割成 name+后缀
   * @param item 获取图片类型
   */
  getmimeType(item) {
    let arr;
    let index;
    arr = item.split('.');
    index = arr.length - 1;
    console.log(arr, 'arr');
    console.log(index, 'index');
    console.log(arr[index], 'arr[index]');
    return arr[index];
  }
  /**
   * 获取图片的媒体类型
   * @param item 图片路径
   */
  doSlice(item) {
    let arr;
    let index;
    arr = item.split('/');
    index = arr.length - 1;
    console.log(arr, 'arr');
    console.log(index, 'index');
    console.log(arr[index], 'arr[index]');
    return arr[index];
  }
/**
 * 通过经纬度获取更 详细的地址
 * @param lon 经度
 * @param lat 纬度
 */
  getTown(lon, lat ) {
    let town;
    const params = {
      ak: '',
      output: 'json',
      coordtype: 'gcj02ll',
      location  : { lat : '', lng : ''}
    };
    params.ak = this.configservice.baiduWebAk;
    params.location.lat = lat;
    params.location.lng = lon;
    let urL;
    urL = this.configservice.baiduWebUrL;
    this.httpservice.get( urL , params , true , res => {
    town = res.town;
    console.log( town, 'town' );
    });
    return  town;
}
   /**
    * 通过传入的code,得到下标获取对应的值
    * @param arr 二维数组
    * @param item 传入值
    */
   getindex(arr, item) {
    let index;
    index = arr[0].indexOf(item);
    console.log('index', index);
    let text;
    text = arr[1][index];
    console.log(' text', text);
    return text;
  }
/**
 * 将获取的对象，转为二维数组存储
 * @param array 被遍历的数组
 * @param brry 二维数组
 */
  getArry(array, brry) {
    array.forEach(element => {
      brry[0].push(element.NAME);
      brry[1].push(element.CODE);
    });
  }

}
