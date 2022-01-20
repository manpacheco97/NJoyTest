const DEVICENAME = "Ace",
  //OTA Service
  SVC_OTA = "1d14d6ee-fd63-4fa1-bfa4-8f47b42119f0",
  CHR_OTA = "f7bf3564-fb6d-4e53-88a4-5e37e0326063",
  CHR_WRITE_OTA_DATA = "984227f3-34fc-4045-a5d0-2c581f81a153",
  START_OTA = 0,
  END_OTA = 3,
  CLOSE_OTA = 4,
  //Max Transfer Unit
  MTU = 23,
  //Other ACE Services and Characteristics
  SVC_PASSWORD = "20aa23ad-b931-4a31-b08a-6f2a38c7b3cd",
  CHR_PASSWORD = "7df106ea-d3b0-ba05-977a-e1fdddf0e978",
  CHR_RNDOM_NMBR = "bd28ebcc-3bc2-9723-123d-f0911fa21670",
  CHR_UNLOCK_COUNT = "ec18caf2-1e96-e9ee-6a3d-b413d5578150",
  SVC_ACE_VAPING = "ae506062-db3d-9992-c0e2-f346deef8fab",
  CHR_POWER_LEVEL = "0c36dc5b-7af1-d9c1-12de-736622b97dda",
  CHR_UNLCK_TIMEOUT = "dad2d1d4-dbf7-ad85-842b-7107f5de655b",
  CHR_UPDATE_PASSWORD = "48f8e136-3162-bc42-9006-d649882fc53da",
  SVC_DEVICE_INFO = 0x180a,
  CHR_SYSTEM_ID = 0x2a23;

function getDeviceInfo() {
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
      log("Getting Device Information Service...");
      return server.getPrimaryService(SVC_DEVICE_INFO);
    })
    .then((service) => {
      log("Gatt service uuid: " + service.uuid);
      log("Getting System id Characteristic...");
      return service.getCharacteristic(CHR_SYSTEM_ID);
    })
    .then((characteristic) => {
      log("Gatt characteristic uuid: " + characteristic.uuid);
      return characteristic.readValue();
    })
    .then((value) => {
      this.isLoader = false;
      let buffer = value.buffer;
      let view = new Uint8Array(buffer);
      log("System id value: " + view);
    })
    .catch((error) => {
      this.isLoader = false;
      this.errorMessage = error.message;
      log("Argh! " + error);
      log("Message! " + errorMessage);
    });
}

async function getDeviceServiceCharacteristic(deviceName, serviceUuid, characteristicUuid) {
  try {
    let options = {
      filters: [{ name: deviceName }],
      optionalServices: [serviceUuid],
    };
    let device = await getDevice(options);
    log("Device name: " + device.name);
    let server = await getGattServer(device);
    log("Server status: " + server.connected);
    let service = await getGattService(server, serviceUuid);
    log("Service uuid: " + service.uuid);
    return await getGattCharacteristic(service, characteristicUuid);
  } catch (error) {
    log("Argh! " + error);
    log("Message! " + error.message);
  }
}

function testReadValMethod() {
  let options = {
    filters: [{ name: DEVICENAME }],
    optionalServices: [SVC_ACE_VAPING, SVC_PASSWORD, SVC_DEVICE_INFO],
  };

  try {
    getDevice(options).then((device) => {
      log("Device name: " + device.name);
      getGattServer(device).then((server) => {
        log("Server status: " + server.connected);
        getGattService(server, SVC_DEVICE_INFO).then((service) => {
          log("Service uuid: " + service.uuid);
          getGattCharacteristic(service, CHR_SYSTEM_ID).then(
            (characteristic) => {
              log("Characteristic uuid: " + characteristic.uuid);
              readGattCharacteristicValue(characteristic)
                .then((value) => {
                  let buffer = value.buffer;
                  let view = new Uint8Array(buffer);
                  log("System id value: " + view);
                })
                .catch((error) => {
                  this.isLoader = false;
                  this.errorMessage = error.message;
                  log("Argh! " + error);
                  log("Message! " + errorMessage);
                });
            }
          );
        });
      });
    });
  } catch (error) {
    log("Argh! " + error);
    log("Message! " + error.message);
  }
}

async function getDevice(options) {
  return navigator.bluetooth.requestDevice(options);
}

async function getGattServer(device) {
  return device.gatt.connect();
}

async function getGattService(server, serviceUuid) {
  return server.getPrimaryService(serviceUuid);
}

async function getGattCharacteristic(service, characteristicUuid) {
  return service.getCharacteristic(characteristicUuid);
}

async function readGattCharacteristicValue(characteristic) {
  return characteristic.readValue();
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
      log("Getting Ace Password Service...");
      return server.getPrimaryService(SVC_PASSWORD);
    })
    .then((service) => {
      log("Gatt service uuid: " + service.uuid);
      log("Getting Random Number Characteristic...");
      return service.getCharacteristic(CHR_RNDOM_NMBR);
    })
    .then((characteristic) => {
      log("Gatt characteristic uuid: " + characteristic.uuid);
      return characteristic.readValue();
    })
    .then((value) => {
      this.isLoader = false;
      let decoder = new TextDecoder("utf-8");
      log("Random Number value: " + decoder.decode(value));
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
