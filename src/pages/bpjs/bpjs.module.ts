import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BpjsPage } from './bpjs';

@NgModule({
  declarations: [
    BpjsPage,
  ],
  imports: [
    IonicPageModule.forChild(BpjsPage),
  ],
})
export class BpjsPageModule {}
