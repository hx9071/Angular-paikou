import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PublicService } from '../../services/public-service/public.service';
import { HttpService } from '../../services/http-service/http.service';
import { ConfigService } from '../../services/config-service/config.service';
import { DeviceInfoService } from '../../services/device-info-service/device-info.service';
import { AutoUpdateService } from '../../services/auto-update-service/auto-update.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // TODO:开发者模式打开, 数据对接完成时关闭
  public IS_DEBUG = false;

  // 登录信息参数
  public userName = '';
  public password = '';

  // 密码显示类型 'password' 'text'
  public passwordType = 'password';

  constructor(
    private router: Router,
    private configService: ConfigService,
    private publicService: PublicService,
    private httpservice: HttpService,
    public navController: NavController,
    private deviceInfoService: DeviceInfoService,
    private autoUpdateService: AutoUpdateService) {
  }

  ngOnInit() {
    // this.checkVersion();
  }

  /**
   * 显示/隐藏 密码
   */
  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  /**
   * 登陆到首页
   */
  loginClick() {

    // TODO: 采用form.valid 验证
    if (!this.userName) {

      this.publicService.thsToast('用户名不能为空');
      return;

    } else if (!this.password) {

      this.publicService.thsToast('密码不能为空');
      return;

    }

    this.login();

    // 上传设备信息
    // this.deviceInfoService

    //   .sendDeviceInfo(this.userName)

    //   .then(res => {

    //     if (res) {
    //       this.login();
    //     }

    //   }, err => {

    //     console.log(err);

    //     this.login();

    //   });

  }

  /**
   * 登录
   */
  login() {

    console.log('in login : deviceInfo', this.deviceInfoService.deviceInfo);

    if (this.IS_DEBUG) {

      // 存储已登录状态
      localStorage.setItem('isLoggedIn', 'true');

      // 上传设备信息
      this.deviceInfoService.sendDeviceInfo(this.userName);

      this.navController.setDirection('root');
      this.router.navigate(['/tabs/track']);
      // this.navController.navigateRoot(['/tabs/track']);
      return;

    }

    const params = {
      loginName: this.userName.trim(),
      password: this.deviceInfoService.md5EncryptParam(this.password.trim())
    };

    this.httpservice.login(params, true, res => {

      // 验证成功
      if (res && res !== 'error' && res.data[0].status === 'success') {

        // 储存用户信息到configService中，程序需要使用
        this.configService.userInfo = res;

        // 储存用户信息到configService中，程序需要使用
        this.configService.userInfo = res;
        this.configService.userInfo.loginName = this.userName;
        this.configService.userInfo.password = this.deviceInfoService.md5EncryptParam(this.password.trim());

        // this.publicService.thsToast(res.message || '登录成功');

        // 上传设备信息
        this.deviceInfoService.sendDeviceInfo(this.userName);

        // 存储已登录状态
        localStorage.setItem('isLoggedIn', 'true');

        // 登录成功跳转首页
        this.navController.setDirection('root');
        this.router.navigate(['/tabs/track']);
        // this.navController.navigateRoot(['/tabs/track']);
      } else {
        // 登录失败
        this.publicService.thsToast(res.message || '用户名或密码错误');  // 信息提示
      }

    });
  }

}
