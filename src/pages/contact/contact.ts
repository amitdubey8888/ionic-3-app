import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  contentInfo = JSON.parse(localStorage.getItem('contact')) || '';
  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public navParams: NavParams) {
    this.getContactDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  getContactDetails() {
    this.api.get('wp/v2/pages/14')
      .subscribe(res => {
        console.log(res);
        this.contentInfo = res['content']['rendered'];
        localStorage.setItem('contact', JSON.stringify(this.contentInfo));
      }, err => {
        console.log(err);
      });
  }

}
