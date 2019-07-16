import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PesanSayaPage } from './pesan-saya';

@NgModule({
  declarations: [
    PesanSayaPage,
  ],
  imports: [
    IonicPageModule.forChild(PesanSayaPage),
  ],
})
export class PesanSayaPageModule {}
