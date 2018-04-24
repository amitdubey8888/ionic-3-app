import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Api, Common } from '../../providers/providers';
import { PostsPage } from '../posts/posts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  currentDate = new Date();
  categories = null;
  selectedCategory = null;
  posts = {};

  constructor(public navCtrl: NavController,
    private api: Api,
    public common: Common
  ) {
    this.categories = this.common.categories;
    this.posts = this.common.categoriesPosts;
  }

  ngAfterViewInit() {
    // this.slides.autoHeight = true;
  }

  goToPost(posts, index) {
    this.common.selectedPostIndex = index;
    this.common.selectedPosts = posts;
    this.common.posts = this.posts;
    this.navCtrl.push('PostsPage');
  }

  goToSearch(){
    this.navCtrl.push('SearchPage');
  }

}
