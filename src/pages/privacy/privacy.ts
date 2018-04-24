import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';



@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  contentInfo = JSON.parse(localStorage.getItem('privacy')) || '';

  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public navParams: NavParams) {
    this.getPrivacyDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacyPage');
  }

  getPrivacyDetails() {
    this.api.get('wp/v2/pages/10175')
      .subscribe(res => {
        console.log(res);
        this.contentInfo = res['content']['rendered'];
        localStorage.setItem('privacy', JSON.stringify(this.contentInfo));
      }, err => {
        console.log(err);
      });
  }

}
