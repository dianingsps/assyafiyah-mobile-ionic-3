import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PulsaListrikPage } from './pulsa-listrik';

@NgModule({
  declarations: [
    PulsaListrikPage,
  ],
  imports: [
    IonicPageModule.forChild(PulsaListrikPage),
  ],
})
export class PulsaListrikPageModule {}
