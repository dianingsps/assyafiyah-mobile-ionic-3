import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCicilanPage } from './payment-cicilan';

@NgModule({
  declarations: [
    PaymentCicilanPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCicilanPage),
  ],
})
export class PaymentCicilanPageModule {}
