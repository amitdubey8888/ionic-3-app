import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';



@IonicPage()
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {
  @ViewChild(Slides) slides: Slides;

  posts = null;
  currentDate = new Date();


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private socialSharing: SocialSharing,
    public common: Common) {
    this.posts = this.common.posts[this.common.selectedPosts.id];
    this.posts.map((post, i) => {
      this.getPostDetails(post, i);
    });
  }

  ionViewDidLoad() {
  }

  ngAfterViewInit() {
    this.slides.autoHeight = true;
  }

  ionViewDidEnter() {
    this.goToSlide();
  }

  goToSlide() {
    this.slides.slideTo(this.common.selectedPostIndex, 0);
  }

  sharePost(post) {
    this.socialSharing.share(post.title.rendered, 'Lawctopus', '', post.link);
  }

  getPostDetails(post, index) {
    this.api.get(`wp/v2/posts/${post.id}`)
      .subscribe(res => {
        console.log(res);
        this.posts[index] = res;
      }, err => {
        console.log(err);
      });
  }
}
