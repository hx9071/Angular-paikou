import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {LoginService} from '../../services/login-service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {

    const url: string = state.url;

    console.log('AuthGuard#canActivate called');
    return this.checkLogin(url);
  }

  /**
   * 检查是否已登录
   * @param url 待跳转路由
   * @returns boolean
   */
  checkLogin(url: string): boolean {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      return true;
    }

    // TODO: PC端管用
    this.loginService.redirectUrl = url;

    // 导航到登录页
    this.router.navigate(['/login']);
    return false;
  }
}
