import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeadlinesPage } from './deadlines';

@NgModule({
  declarations: [
    DeadlinesPage,
  ],
  imports: [
    IonicPageModule.forChild(DeadlinesPage),
  ],
})
export class DeadlinesPageModule {}
