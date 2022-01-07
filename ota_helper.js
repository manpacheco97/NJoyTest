let otaControl = new Uint8Array(1);



function sendEndOta(service) {
  otaControl[0] = ENV.END_OTA;
}

function writeOtaControl(otaControl) {}
