import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  contentInfo = JSON.parse(localStorage.getItem('about')) || '';
  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public navParams: NavParams) {
    this.getAboutDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  getAboutDetails() {
    this.api.get('wp/v2/pages/2')
      .subscribe(res => {
        console.log(res);
        this.contentInfo = res['content']['rendered'];
        localStorage.setItem('about', JSON.stringify(this.contentInfo));
      }, err => {
        console.log(err);
      });
  }

}
