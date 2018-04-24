import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-deadlines',
  templateUrl: 'deadlines.html',
})
export class DeadlinesPage {
  contentInfo = JSON.parse(localStorage.getItem('deadLines')) || '';

  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public navParams: NavParams) {
      this.getUpcomingDeadlines();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeadlinesPage');
  }

  getUpcomingDeadlines() {
    this.api.get(`wp/v2/pages/166666`)
      .subscribe(res => {
        console.log('Deallines:', res);
        this.contentInfo = res['content']['rendered'];
        localStorage.setItem('deadLines', JSON.stringify(this.contentInfo));
      }, err => {
        console.log(err);
      });
  }

}
