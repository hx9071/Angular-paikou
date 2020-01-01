import {Component, OnInit, OnDestroy, ElementRef, Output, Input, EventEmitter, NgZone} from '@angular/core';
import {Router} from '@angular/router';

import {Keyboard} from '@ionic-native/keyboard/ngx';

import {PublicService} from '../../services/public-service/public.service';
import {AlertController} from '@ionic/angular'; // 引入公共方法

/**
 * 关联搜索组件，从关联的搜索关键字列表中选取一个返回
 * usage:
 * <app-search-modal
 *     [config]="searchConfig"
 *     (getSearchText)="getSearchText($event)">
 * </app-search-modal>
 */

/**
 * @property {Object} config 参数
 * { String } config.searchKey 搜索的键名 比如: 'name', 'title'
 * { String } config.searchPlaceholder 搜索默认提示
 * { String } config.interfaceUrl 搜索列表的接口地址
 * { String } config.resultListKey 搜索列表的接口返回列表的键名, 比如 res.list 中的键名就是 'list'，如果res就是返回的数字，将此参数设置成''即可
 * { Boolean } config.showLoading 是否显示加载动画
 * { Boolean } config.openSearchExp 开启搜索匹配，该属性为真的时候，当搜索结果列表中搜索字段对应值包含搜索字段值的时候才能进行搜索
 * { Object } config.searchParams 搜索分页参数 {page:1 //搜索页码, pageSize:10 // 每页搜索数}
 *
 * @callback shouldSearch
 *
 * { searchText, searchList }
 */
@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit, OnDestroy {

  // 搜索结果列表
  resultList = [];

  // 列表是否显示
  isShowResultList = false;

  // 是否加载更多
  loadMore = true;

  // 组件配置参数
  @Input() config: any = {};

  // 返回搜索关键字
  @Output() getSearchText = new EventEmitter<any>();

  constructor(private elementRef: ElementRef,
              private router: Router,
              private keyboard: Keyboard,
              private publicService: PublicService,
              public alertController: AlertController,
              private zone: NgZone) {

  }

  ngOnInit() {

    // 渲染静态视图数据
    this.renderStaticView();

    // 渲染异步数据
    this.renderAsyncView();

  }

  ngOnDestroy() {
    console.log('in ngOnDestroy');
  }

  /**
   * 渲染静态视图数据
   */
  private renderStaticView() {

    this.zone.run(() => {
      setTimeout(() => {
        const el = this.elementRef.nativeElement.querySelector('.searchbar-input input');
        el.focus();

        this.keyboard.show();
      }, 400);
    });

    console.log('in renderStaticView: config', this.config);

    this.config.searchParams[this.config.searchKey] = '';
    this.config.searchText = '';

  }

  /**
   * 渲染动态视图数据
   */
  private renderAsyncView() {


  }

  /**
   * 获取列表
   *  @param {boolean} isAppend 加载方式 刷新 false 加载 true
   *  @param {boolean} flag  是否显出loading
   *  @param event? 刷新 或 加载事件
   */
  getSearchList(isAppend = false, event?) {
    this.publicService[this.config.method](this.config.interfaceUrl, this.config.searchParams, this.config.showLoading, res => {
      if (!res) {
        return;
      }

      if (!this.config.resultListKey) {
		res.list = res;
        this.config.resultListKey = 'list';
      }

      if (!res[this.config.resultListKey] || res[this.config.resultListKey].length === 0) {
        this.resultList = [];
        this.loadMore = false;
        return;
      }

      this.loadMore = true;
      this.resultList = isAppend ? res[this.config.resultListKey].concat(...res[this.config.resultListKey]) : res[this.config.resultListKey];

      this.config.resultListKey = this.config.resultListKey || '';

      if (event) {
        event.target.complete();
      }

    });

    // TODO: 开发完成后删除
    /*
      this.getInnerList()

      .then(res => {

        if (!res) {
          return;
        }

        if (!this.config.resultListKey) {
          res.list = res;
          this.config.resultListKey = 'list';
        }

        if (!res[this.config.resultListKey] || res[this.config.resultListKey].length === 0) {
          this.resultList = [];
          this.loadMore = false;
          return;
        }

        this.loadMore = true;
        this.resultList = isAppend ? res[this.config.resultListKey].concat(...res[this.config.resultListKey]) : res[this.config.resultListKey];

        this.config.resultListKey = this.config.resultListKey || '';

        if (event) {
          event.target.complete();
        }

      });
    */

  }

  /**
   * 外部传入的获取列表函数
   */
  getInnerList() {

    const params = this.config.searchParams;

    const promise = new Promise((resolve, reject) => {

      const resultList = [];
      const resObj = {
        [this.config.resultListKey]: []
      };

      for (let index = 0; index < params.pageSize; index++) {
        resultList.push({
          lakeName: `涨渡湖${index}`,
          lakePipeNum: index,
          regionName: `江岸区${index}`
        });
      }

      resObj[this.config.resultListKey] = resultList.filter(item => item.lakeName.indexOf(params[this.config.searchKey]) !== -1);

      resolve(resObj);

    });

    return promise;

  }

  /**
   * 输入关键字进行关联搜索
   */
  searchList() {

    if (!this.config.searchText) {

      this.isShowResultList = false;
      this.resultList = [];
      return;
    }

    // 更新参数
    this.config.searchParams[this.config.searchKey] = this.config.searchText;

    this.isShowResultList = true;
    this.getSearchList(false);
  }

  /**
   * 选择
   * @param item 选中的
   */
  selectItem(item) {
    this.config.searchText = item[this.config.searchKey];
  }

  /**
   * 确认搜索
   */
  async shouldSearch() {

    if (!this.canSearch()) {

      const alert = await this.alertController.create({
        message: '请选择下拉框中的内容进行搜索'
      });

      await alert.present();
      return;
    }

    this.getSearchText.emit({
      searchText: this.config.searchText,
      searchList: this.resultList
    });
  }

  /**
   * 判断列表里的值是否包含搜索文字，包含才允许搜索
   */
  private canSearch() {

    // 搜索匹配参数为假或搜索条件为空则强制允许搜索
    if (!this.config.openSearchExp || !this.config.searchText) {
      return true;
    }

    return this.resultList.some(resultItem => resultItem[this.config.searchKey] === this.config.searchText);
  }

  /**
   * 关闭信息列表框
   */
  closeSearchBox() {
    this.isShowResultList = false;
  }

  /**
   * 跳转详情页
   * @param item 列表对象
   */
  goDetail(item) {
    this.router.navigate(['login'], {
      queryParams: {}
    });
  }

  /**
   * 上拉加载事件
   * @param event 事件
   */
  loadData(event) {
    this.config.searchParams.page++;
    this.getSearchList(false, event);
  }
}
