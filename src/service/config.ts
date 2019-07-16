export class Config{  

  cNamaApp  = "Ceria Digital";
  cVersiApp = "1.1.3"; 
 
  // dev beta
  // cURL        = "http://aa.src7.sis1.net/assist-switching/index.php" ;
  // cURLProduk  = "http://aa.src7.sis1.net/assist-switching/index.php" ; 

  // release metode baru
  cURL        = "http://mcoll.sis1.net:2735/assist-switching/index.php" ;
  cURLProduk  = "http://mcoll.sis1.net:2735/assist-switching/index.php" ;

  KodeBank    = "0009"; //"0009" ;  // tiap BPR berbeda beda
  SerialSIM   = localStorage.getItem("SIMSerial") ;
  AppUser     = "default" ; 
  AppPass     = "default" ;   
 
  
  //kode request data ppob
  AmbilDataProduk = "1";
  AmbilDataMenu   = "2"; 
  AmbilDataPrefix = "4";
  GetToken        = "5";
  GetTrx          = "6";
  GetKodeBank     = "7"; 
 
}