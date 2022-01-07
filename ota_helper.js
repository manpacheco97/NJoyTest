const START_OTA = 0;
const END_OTA = 3;
let otaControl = new Uint8Array(1);

function startOta(server){
  otaControl[0] = START_OTA;

}

function endOta(server){
  otaControl[0] = END_OTA;
}

function writeOtaControl(otaControl){

}