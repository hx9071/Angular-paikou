import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticConfigService {

  public store = {};

  constructor() {
  }

  /**
   * 设置缓存
   * @param name 缓存名称
   * @param cache 缓存内容
   */
  setStore(name, cache) {
    this.store[name] = cache;
  }

  /**
   * 获取缓存
   * @param name 缓存名称
   */
  getStore(name) {
    return this.store[name];
  }

  /**
   * 清除缓存
   * @param name 缓存名称
   */
  removeStore(name) {
    delete this.store[name];
  }

}
