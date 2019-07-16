import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeSlidesPage } from './home-slides';

@NgModule({
  declarations: [
    HomeSlidesPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeSlidesPage),
  ],
})
export class HomeSlidesPageModule {}
