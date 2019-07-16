import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingCallCenterPage } from './setting-call-center';

@NgModule({
  declarations: [
    SettingCallCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingCallCenterPage),
  ],
})
export class SettingCallCenterPageModule {}
