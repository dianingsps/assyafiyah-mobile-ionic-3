import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component'; 
import { SuperTabsModule } from '../ionic2-super-tabs/src';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HttpModule } from '@angular/http';
import { IndexPage } from '../pages/index/index';
import { AkunPage } from '../pages/akun/akun';
import { SettingPage } from '../pages/setting/setting';
import { Func } from '../service/func'
import { Config } from '../service/config'
import { FuncDatabase } from '../service/funcdatabase'
import { TransferPage } from '../pages/transfer/transfer';
import { PulsaPage } from '../pages/pulsa/pulsa';
import { BpjsPage } from '../pages/bpjs/bpjs';
import { PaymentPage } from '../pages/payment/payment';
import { RiwayatPage } from '../pages/riwayat/riwayat';
import { AkunCeksaldoPage } from '../pages/akun-ceksaldo/akun-ceksaldo';
import { AkunMutasiPage } from '../pages/akun-mutasi/akun-mutasi';
import { AkunListMutasiPage } from './../pages/akun-list-mutasi/akun-list-mutasi';
import { AkunMutasiDetailPage } from '../pages/akun-mutasi-detail/akun-mutasi-detail';
import { TransferDaftarPage } from '../pages/transfer-daftar/transfer-daftar';
import { PulsaHpPage } from '../pages/pulsa-hp/pulsa-hp';
import { PulsaListrikPage } from '../pages/pulsa-listrik/pulsa-listrik';
import { PulsaListrikBayarPage } from '../pages/pulsa-listrik-bayar/pulsa-listrik-bayar';
import { PaymentCicilanPage } from '../pages/payment-cicilan/payment-cicilan';
import { PaymentListrikPage } from '../pages/payment-listrik/payment-listrik';
import { PaymentPdamPage } from '../pages/payment-pdam/payment-pdam';
import { PaymentTeleponPage } from '../pages/payment-telepon/payment-telepon';
import { HomeMasukTokenPage } from '../pages/home-masuk-token/home-masuk-token';
import { SettingGantiPinPage } from '../pages/setting-ganti-pin/setting-ganti-pin';
import { SettingUbahRekeningPage } from '../pages/setting-ubah-rekening/setting-ubah-rekening';
import { PesanSayaPage } from '../pages/pesan-saya/pesan-saya';
import { PaymentCicilanBayarPage } from '../pages/payment-cicilan-bayar/payment-cicilan-bayar';
import { TransferProsesPage } from '../pages/transfer-proses/transfer-proses';
import { SettingAmbilProdukPage } from '../pages/setting-ambil-produk/setting-ambil-produk';
import { PaymentListrikBayarPage } from '../pages/payment-listrik-bayar/payment-listrik-bayar' ;
import { HomeSlidesPage } from '../pages/home-slides/home-slides' ;
import { SettingGantiPassPage } from '../pages/setting-ganti-pass/setting-ganti-pass'; 
import { SettingRiwayatPage } from '../pages/setting-riwayat/setting-riwayat';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomeEnterNumberphonePage } from '../pages/home-enter-numberphone/home-enter-numberphone';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HTTP } from '@ionic-native/http';
import { Sim } from '@ionic-native/sim';
import { SMS } from '@ionic-native/sms';
import { Md5 } from 'ts-md5/dist/md5';   
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SQLite } from '@ionic-native/sqlite';
import { Push } from '@ionic-native/push';
import { Screenshot } from '@ionic-native/screenshot';
import { RiwayatDetailTransferAntarbankPage } from '../pages/riwayat-detail-transfer-antarbank/riwayat-detail-transfer-antarbank';
import { TransferAntarBankPage } from '../pages/transfer-antar-bank/transfer-antar-bank';
import { BpjsBayarPage } from '../pages/bpjs-bayar/bpjs-bayar';
import { SettingCallCenterPage } from '../pages/setting-call-center/setting-call-center';
import { HomeMenuPage } from '../pages/home-menu/home-menu';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    IndexPage,
    AkunPage,
    SettingPage,
    TransferPage,  
    PulsaPage,
    BpjsPage,
    PaymentPage,
    RiwayatPage,
    AkunCeksaldoPage,
    AkunMutasiPage,
    AkunListMutasiPage,
    AkunMutasiDetailPage,
    TransferDaftarPage,
    PulsaListrikPage,
    PulsaListrikBayarPage,
    PulsaHpPage,
    PaymentListrikPage,
    PaymentPdamPage,
    PaymentTeleponPage,
    PaymentCicilanPage, 
    HomeMasukTokenPage,
    SettingGantiPinPage,
    SettingUbahRekeningPage,
    PesanSayaPage,
    PaymentCicilanBayarPage,
    TransferProsesPage,
    SettingAmbilProdukPage,
    PaymentListrikBayarPage,
    HomeSlidesPage, 
    SettingGantiPassPage,
    SettingRiwayatPage,
    WelcomePage,
    HomeEnterNumberphonePage,
    RiwayatDetailTransferAntarbankPage,
    TransferAntarBankPage,
    BpjsBayarPage,
    SettingCallCenterPage,
    HomeMenuPage
  ],
  imports: [ 
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage ,
    IndexPage,
    AkunPage,
    SettingPage,
    TransferPage,
    PulsaPage,
    BpjsPage,
    PaymentPage,
    RiwayatPage,
    AkunCeksaldoPage,
    AkunMutasiPage,
    AkunListMutasiPage,
    AkunMutasiDetailPage,
    TransferDaftarPage,
    PulsaHpPage,
    PulsaListrikPage,
    PulsaListrikBayarPage,
    PaymentListrikPage,
    PaymentPdamPage,
    PaymentTeleponPage,
    PaymentCicilanPage,
    HomeMasukTokenPage,
    SettingGantiPinPage,
    SettingUbahRekeningPage,
    PesanSayaPage,
    PaymentCicilanBayarPage,
    TransferProsesPage,
    SettingAmbilProdukPage,
    PaymentListrikBayarPage,
    HomeSlidesPage,
    SettingGantiPassPage,
    SettingRiwayatPage,
    WelcomePage,
    HomeEnterNumberphonePage,
    RiwayatDetailTransferAntarbankPage,
    TransferAntarBankPage,
    BpjsBayarPage,
    SettingCallCenterPage,
    HomeMenuPage
  ],
  providers: [ 
    StatusBar, 
    SplashScreen,
    HttpModule, 
    Func,
    Config,
    FuncDatabase,
    HTTP,
    Sim,
    SMS,
    Md5,
    AppVersion,
    AndroidPermissions,
    SQLite,
    Push,
    Screenshot,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule { 

}