import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentListrikPage } from './payment-listrik';

@NgModule({
  declarations: [
    PaymentListrikPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentListrikPage),
  ],
})
export class PaymentListrikPageModule {}
