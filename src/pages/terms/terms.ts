import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  contentInfo = JSON.parse(localStorage.getItem('terms')) || '';
  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public navParams: NavParams) {
    this.getTermsDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

  getTermsDetails() {
    this.api.get('wp/v2/pages/10174')
      .subscribe(res => {
        console.log(res);
        this.contentInfo = res['content']['rendered'];
        localStorage.setItem('terms', JSON.stringify(this.contentInfo));
      }, err => {
        console.log(err);
      });
  }

}
