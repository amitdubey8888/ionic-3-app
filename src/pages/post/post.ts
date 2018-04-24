import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  post = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private socialSharing: SocialSharing,
    public common: Common) {
      this.post = this.common.post;
      console.log('test',this.post);
  }

  ionViewDidLoad() {
    
  }

  sharePost(post) {
    console.log(post);
    this.socialSharing.share(post.title.rendered, 'Lawctopus', '', post.link);
  }

}
