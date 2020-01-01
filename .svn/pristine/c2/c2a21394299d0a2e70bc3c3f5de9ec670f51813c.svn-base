import { Component, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss']
})
export class ShowImageComponent {
  @Input() photos: any;
  @Input() initialSlide: number;

  pictures = []; // 存放图片
  slideOpts = {
    // 滑动配置
    initialSlide: 1,
    speed: 400
  };
  maxWidth: number; // 屏幕宽度
  constructor(public navParams: NavParams, public modalCtrl: ModalController) {
    if (Array.isArray(this.navParams.data.photos)) {
      this.pictures = this.navParams.data.photos;
    } else {
      this.pictures = [];
      this.pictures.push(this.navParams.data.photos);
    }
    this.slideOpts.initialSlide = this.navParams.data.initialSlide;
    this.maxWidth = window.screen.availWidth;
  }

  /**
   * 关闭当前页面
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
