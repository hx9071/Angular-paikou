import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {PublicService} from '../public-service/public.service'; // 引入公共方法
import {ConfigService} from '../config-service/config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public redirectUrl: string;

  constructor(private publicService: PublicService,
              private configService: ConfigService,
              private router: Router) {
  }

  /**
   * 退出登录
   */
  public logout() {

    console.log('退出登录成功');

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userLocation');

    // 清除服务里的登录信息
    this.configService.userInfo.loginName = '';
    this.configService.userInfo.password = '';

    this.router.navigate(['/login']);

  }

}
