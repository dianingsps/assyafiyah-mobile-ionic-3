import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentPdamPage } from './payment-pdam';

@NgModule({
  declarations: [
    PaymentPdamPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPdamPage),
  ],
})
export class PaymentPdamPageModule {}
