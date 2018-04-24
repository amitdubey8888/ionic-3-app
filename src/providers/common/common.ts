import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class Common {

  public categories = null;
  public states = null;
  public cities = null;
  public posts = {};
  public categoriesPosts = {};
  public statesPosts = {};
  public citiesPosts = {};
  public selectedCategory = null;
  public selectedPosts = null;
  public selectedPostIndex = 0;
  public categoriesImages = {};
  public stateImages = {};
  public citiesImages = {};
  public images = {};
  public post = null;

  constructor(public http: HttpClient) {
    this.categories = JSON.parse(localStorage.getItem('categories'));
    this.states = JSON.parse(localStorage.getItem('states'));
    this.cities = JSON.parse(localStorage.getItem('cities'));
    this.categoriesPosts = JSON.parse(localStorage.getItem('categoriesPosts')) || {};
    this.statesPosts = JSON.parse(localStorage.getItem('statesPosts')) || {};
    this.citiesPosts = JSON.parse(localStorage.getItem('citiesPosts')) || {};
  }

}
