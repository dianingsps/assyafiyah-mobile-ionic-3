import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentTeleponPage } from './payment-telepon';

@NgModule({
  declarations: [
    PaymentTeleponPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentTeleponPage),
  ],
})
export class PaymentTeleponPageModule {}
