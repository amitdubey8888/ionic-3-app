import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Api, Common } from '../providers/providers';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HomePage } from '../pages/home/home';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  segment = 'categories';
  categories = null;
  states = null;
  cities = null;
  posts = {};
  selectedOption = '';
  sideMenu = JSON.parse(localStorage.getItem('sideMenu')) || null;

  pages: Array<{ title: string, component: any }>;

  settingsMenu = [];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    private api: Api,
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public common: Common,
    private deeplinks: Deeplinks,
    private oneSignal: OneSignal,
    public splashScreen: SplashScreen) {

    this.initializeApp();
  }
  ngOnInit() {
    if (this.platform.is('cordova')) {

      this.oneSignal.startInit('3560d133-e75c-4229-9049-c22e2f102ffc', '225130845416');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe((res) => {
        // do something when a notification is opened
        console.log('One:',res);
      });
      this.oneSignal.endInit();

      this.deeplinks.routeWithNavController(this.nav, {
        '/about-us': "AboutPage",
        '/products/:productId': "ProductPage"
      }).subscribe((match) => {
        console.log('Successfully matched route', match);
      }, (nomatch) => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.categories = this.common.categories;
      this.states = this.common.states;
      this.cities = this.cities;
      this.posts = this.common.categoriesPosts;
      this.getCategories();
      // this.getStates();
      // this.getCities();
      this.getAppMenus();
      // this.getLatestPosts();
    });
  }

  getCategories() {
    this.api.get('wp/v2/categories')
      .subscribe(res => {
        this.categories = res;
        this.categories.unshift({ id: 1, name: 'Latest Posts' });
        localStorage.setItem('categories', JSON.stringify(this.categories));
        this.common.categories = this.categories;
        this.categories.map(category => {
          this.getPosts(category);
        });
      }, err => {
        console.log('Error:', err);
      });
  }

  getStates() {
    this.api.get('wp/v2/states')
      .subscribe(res => {
        this.states = res || this.common.states;
        localStorage.setItem('states', JSON.stringify(this.states));
        this.common.states = this.states;
        this.states.map(state => {
          this.getStatePosts(state);
        });
      }, err => {
        console.log(err);
      });
  }

  getCities() {
    this.api.get('wp/v2/cities')
      .subscribe(res => {
        this.cities = res || this.cities;
        localStorage.setItem('cities', JSON.stringify(this.cities));
        this.common.cities = this.cities;
        this.cities.map(city => {
          this.getCityPosts(city);
        });
      }, err => {
        console.log(err);
      });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }


  getPosts(category) {
    let filter = '';
    if (category.id !== 1) {
      filter = `?categories=${category.id}`;
    }
    this.api.get(`wp/v2/posts${filter}`)
      .subscribe(res => {
        console.log(res);
        this.posts[`${category.id}`] = res;
        localStorage.setItem('categoriesPosts', JSON.stringify(this.posts));
        this.common.categoriesPosts = this.posts;
        this.posts[`${category.id}`].map(post => {
          this.getPostImages(post);
        });
      }, err => {
        console.log(err);
      });
  }

  getStatePosts(state) {
    let stateName = state.name.replace(/[^a-z0-9]/gi, ' ').replace(/  +/g, ' ').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    this.api.get(`wp/v2/posts?filter[states]=${stateName}`)
      .subscribe(res => {
        this.common.statesPosts[`${state.id}`] = res || [];
        localStorage.setItem('statesPosts', JSON.stringify(this.common.statesPosts));
      }, err => {
        console.log(err);
      });
  }

  getCityPosts(city) {
    let cityName = city.name.replace(/[^a-z0-9]/gi, ' ').replace(/  +/g, ' ').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    this.api.get(`wp/v2/posts?filter[cities]=${cityName}`)
      .subscribe(res => {
        this.common.citiesPosts[`${city.id}`] = res || [];
        localStorage.setItem('citiesPosts', JSON.stringify(this.common.citiesPosts));
      }, err => {
        console.log(err);
      });
  }

  getPostImages(post) {
    const hrefArray = post._links["wp:featuredmedia"] ? post._links["wp:featuredmedia"][0]['href'].split('/') : [];
    if (hrefArray.length) {
      const id = hrefArray[hrefArray.length - 1];
      this.api.get(`wp/v2/media/${id}`)
        .subscribe(res => {
          this.common.images[`${post.id}`] = res['source_url'] || '';
        }, err => {
          console.log(err);
        });
    }
  }

  goToPost(selectedCategory) {
    this.selectedOption = '';
    // console.log(selectedCategory);
    this.common.selectedPostIndex = 0;
    this.common.selectedPosts = selectedCategory;
    this.common.posts = this.posts;
    this.nav.push('PostsPage');
  }

  shareApp() {
    this.socialSharing.share('Get latest updates of Indian Laws', 'Lawctopus', '', 'https://www.lawctopus.com/');
  }

  getAppMenus() {
    this.api.get(`wp-api-menus/v2/menus/87832`)
      .subscribe(res => {
        // console.log(res);
        this.sideMenu = res;
        localStorage.setItem('sideMenu', JSON.stringify(this.sideMenu));
        this.sideMenu.items.map(item => {
          if (item.title !== 'Home' && item.title !== 'Knowledge Base') {
            this.getSideMenuPosts(item);
          }
        });
      }, err => {
        console.log(err);
      });
  }

  getSideMenuPosts(menu) {
    this.api.get(`wp/v2/posts?categories=${menu.object_id}`)
      .subscribe(res => {
        this.posts[`${menu.id}`] = res || [];
        localStorage.setItem('categoriesPosts', JSON.stringify(this.posts));
        this.common.categoriesPosts = this.posts;
        this.posts[`${menu.id}`].map(post => {
          this.getPostImages(post);
        });
      }, err => {
        console.log(err);
      });

    menu.children.map(child => {
      this.getSubMenuPosts(child);
    });
  }

  getSubMenuPosts(subMenu) {
    this.api.get(`wp/v2/posts?categories=${subMenu.object_id}`)
      .subscribe(res => {
        this.posts[`${subMenu.id}`] = res || [];
        localStorage.setItem('categoriesPosts', JSON.stringify(this.posts));
        this.common.categoriesPosts = this.posts;
        this.posts[`${subMenu.id}`].map(post => {
          this.getPostImages(post);
        });
      }, err => {
        console.log(err);
      });
  }

  goToPage(page) {
    console.log(page);
    this.nav.push(page);
  }

  getLatestPosts() {
    this.api.get(`wp/v2/posts`)
      .subscribe(res => {
        this.posts['1'] = res || [];
        localStorage.setItem('categoriesPosts', JSON.stringify(this.posts));
        this.common.categoriesPosts = this.posts;
        this.posts['1'].map(post => {
          this.getPostImages(post);
        });
      }, err => {
        console.log(err);
      });
  }



  goToSocial(link) {
    const browser = this.iab.create(link);
    // browser.executeScript();
    // browser.insertCSS();
    // browser.close()
  }

  rateApp() {
    console.log('Rate');
  }

  sendFeedback() {
    console.log('Feedback');
  }

  subscribeNewsLetter() {
    console.log('News Letter');
  }

}
