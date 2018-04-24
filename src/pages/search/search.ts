import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  shouldShowCancel = true;
  myInput;
  posts = null;
  message = '';

  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  onInput(event) {
    if (event.which == 13 || event.keyCode == 13) {
      let search = event.target.value.replace(/ /g, '+');
      console.log(event, search);
      let loader = this.loadingCtrl.create({
        content: "Searching...",
        duration: 3000
      });
      loader.present();
      this.api.get(`wp/v2/search/${search}`)
        .subscribe(res => {
          console.log(res);
          this.posts = res;
          loader.dismiss();
          if(this.posts.length === 0){
            this.message = 'No record found';
          }else{
            this.message = '';            
          }
          this.posts.map(post => {
            this.getPostImages(post);
          });
        }, err => {
          loader.dismiss();          
          console.log(err);
        });
    }
  }

  onCancel() {
    console.log('Cancel');
    this.navCtrl.pop();
  }

  getPostImages(post) {

    const hrefArray = post._links && post._links["wp:featuredmedia"] ? post._links["wp:featuredmedia"][0]['href'].split('/') : [];
    if (hrefArray.length) {
      const id = hrefArray[hrefArray.length - 1];
      this.api.get(`wp/v2/media/${id}`)
        .subscribe(res => {
          this.common.images[`${post.id}`] = res['source_url'];
        }, err => {
          console.log(err);
        });
    }
  }

  goToPost(post){
    this.common.post = post;
    console.log('Post', post)
    this.navCtrl.push('PostPage');
  }
}
