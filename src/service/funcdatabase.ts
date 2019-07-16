import { Component } from '@angular/core';
import { AlertController,ToastController,LoadingController,Loading } from 'ionic-angular'; 
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 

@Component({
  
}) 

export class FuncDatabase {  

  loading: Loading;
  data:any = {} ;
  
  constructor(
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public sqlite: SQLite) { 
  } 

  /*********************************************** CREATE DATABASE ***********************************************/

  initDBMutasi(){     
    let cSQL = 'CREATE TABLE IF NOT EXISTS mutasi(trx VARCHAR(20),'+
                'kode VARCHAR(8),trxid VARCHAR(20),tgl VARCHAR(20),noresi VARCHAR(20),namakredit VARCHAR(32),nokontrak VARCHAR(50),'+
                'nama VARCHAR(50),namapelanggan VARCHAR(100),idreff VARCHAR(100),noangsuran VARCHAR(20),jumlahtagihan VARCHAR(30),'+
                'admin VARCHAR(30),total VARCHAR(30),datetime VARCHAR(30),jenis VARCHAR(20),rekening VARCHAR(30),nohp VARCHAR(20),'+
                'namaproduk VARCHAR(100),idpelanggan VARCHAR(30),nometer VARCHAR(30),daya VARCHAR(20), ref VARCHAR(50),'+
                'bulan VARCHAR(50),standmeter VARCHAR(30),materai VARCHAR(30),ppn VARCHAR(20), ppj VARCHAR(50),pesan VARCHAR(200),'+
                'angsuran VARCHAR(30),stroom VARCHAR(30),kwh VARCHAR(30),tokenlistrik VARCHAR(30), status VARCHAR(20), keterangan VARCHAR(255))';
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table mutasi'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  initDBMutasiFinance(){     
    let cSQL = 'CREATE TABLE IF NOT EXISTS mutasi_finance(' + 
                'trxid_finance VARCHAR(20),noresi VARCHAR(20),namakredit VARCHAR(32),nokontrak VARCHAR(50),'+
                'nama VARCHAR(50),namapelanggan VARCHAR(100),idreff VARCHAR(100),noangsuran VARCHAR(20))';
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table mutasifinance'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  initDBTransferRekening(){
    let  cSQL = 'CREATE TABLE IF NOT EXISTS transfer_rekening(rekening VARCHAR(32),nama VARCHAR(50),datetime varchar(30))' ;
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table transfer_rekening'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));  
  }

  initDBDataProduk(){
    let cSQL = 'CREATE TABLE IF NOT EXISTS dataproduk(kode VARCHAR(8),kodeproduk VARCHAR(8),biller VARCHAR(8),produkid VARCHAR(8),nominal VARCHAR(20),keterangan VARCHAR(50),jenis VARCHAR(4),datetime varchar(30))' ;
    this.sqlite.create({ 
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table dataproduk'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));  
  } 

  initDBOperator(){
    let cSQL = 'CREATE TABLE IF NOT EXISTS operator(kode VARCHAR(2),prefix VARCHAR(4),kodeoperator VARCHAR(2))' ;
    this.sqlite.create({ 
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table operator'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));  
  } 

  initDBPesan(){     
    let cSQL = 'CREATE TABLE IF NOT EXISTS message(' + 
                'judul VARCHAR(150),pesan VARCHAR(255),datetime VARCHAR(30))';
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table message'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  initDelDBKodeBank(){     
    let cSQL = 'delete from kodebank';
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('delete table kodebank'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }
  
  initDBKodeBank(){     
    let cSQL = 'CREATE TABLE IF NOT EXISTS kodebank(' + 
                'kode char(3),nama VARCHAR(100))';
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('create table kodebank'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  /******************************************** END OF CREATE DATABASE ********************************************/

}