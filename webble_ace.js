function getDeviceInfo() {
  let options = {
    filters: [{ name: DEVICENAME }],
  };

  log("Requesting BLE device info...");
  navigator.bluetooth
    .requestDevice(options)
    .then((device) => {
      log("Connecting to GATT Server...");
      return device.gatt.connect();
    })
    .then((server) => {
      log("Getting Services...");
      return server.getPrimaryServices();
    })
    .then((services) => {
      log("Getting Characteristics...");
      let queue = Promise.resolve();
      services.forEach((service) => {
        queue = queue.then((_) =>
          service.getCharacteristics().then((characteristics) => {
            log("> Service: " + service.uuid);
            characteristics.forEach((characteristic) => {
              log(
                ">> Characteristic: " +
                  characteristic.uuid +
                  " " +
                  getSupportedProperties(characteristic)
              );
            });
          })
        );
      });
      return queue;
    })
    .catch((error) => {
      log("Argh! " + error);
    });
}

function getCharacteristic() {

  let options = {
    filters: [{ name: DEVICENAME }],
    optionalServices: [SVC_ACE_VAPING, SVC_PASSWORD, SVC_DEVICE_INFO],
  };

  log("Requesting BLE device info...");
  navigator.bluetooth
    .requestDevice(options)
    .then((device) => {
      log("Connecting to GATT Server...");
      return device.gatt.connect();
    })
    .then((server) => {
      log("Gatt server status: " + server.connected);
      log("Getting Service...");
      return server.getPrimaryService(SVC_PASSWORD);
      //return server.getPrimaryService(SVC_ACE_VAPING);
    })
    .then((service) => {
      log("Gatt service uuid: " + service.uuid);
      log("Getting Characteristics...");
      return service.getCharacteristic(CHR_RNDOM_NMBR);
      //return service.getCharacteristic(CHR_UNLCK_TIMEOUT);
    })
    .then((characteristic) => {
      //characteristic.startNotifications()
      log("Gatt characteristic uuid: " + characteristic.uuid);
      // console.log('Characteristic value: '+ characteristic.value)
      return characteristic.readValue();
    })
    .then((value) => {
      log("Entre en value");
      log(value);
      this.isLoader = false;
      let decoder = new TextDecoder("utf-8");
      log(decoder.decode(value));
    })
    .catch((error) => {
      this.isLoader = false;
      this.errorMessage = error.message;
      log("Argh! " + error);
      log("Message! " + errorMessage);
    });
}

function writeCharacteristic() {

  let options = {
    filters: [{ name: DEVICENAME }],
    optionalServices: [SVC_OTA],
  };

  log("Reading file...");
  let files = getFiles();
  let file = files[0];
  var totalBytes = new Uint8Array(file.size);
  log("Bytes in file: " + totalBytes.length);

  log("Requesting BLE device info...");
  navigator.bluetooth
    .requestDevice(options)
    .then((device) => {
      log("Connecting to GATT Server...");
      return device.gatt.connect();
    })
    .then((server) => {
      log("Gatt server status: " + server.connected);
      log("Getting Service...");
      return server.getPrimaryService(SVC_OTA);
    })
    .then((service) => {
      log("Gatt service uuid: " + service.uuid);
      log("Getting Characteristics...");
      return service.getCharacteristic(CHR_OTA);
    })
    .then((characteristic) => {
      log("Gatt characteristic uuid: " + characteristic.uuid);
      //log("Descriptors: " + characteristic.getDescriptors());
      return characteristic.readValue();
    })
    .then((value) => {
      log("Entre en value");
      log(value);
      this.isLoader = false;
      let decoder = new TextDecoder("utf-8");
      log(decoder.decode(value));
    })
    .catch((error) => {
      this.isLoader = false;
      this.errorMessage = error.message;
      log("Argh! " + error);
      log("Message! " + errorMessage);
    });
}

function isWebBLEAvailable() {
  if (!navigator.bluetooth) {
    log("Web Bluetooth is not available!");
    return false;
  }
  Output.clearLog();
  return true;
}
