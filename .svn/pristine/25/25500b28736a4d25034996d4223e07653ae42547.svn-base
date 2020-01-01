import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config-service/config.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('tabs') tabs: IonTabs;
  constructor( public configService: ConfigService) {

  }

  ngOnInit(): void {
    this.configService.tabsRoute = this.tabs;
  }

}
