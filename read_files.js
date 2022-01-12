function readFileBlob(file) {
  let buffer = new ArrayBuffer(20);
  let view = new Uint8Array(buffer);

  reader = new FileReader();
  reader.readAsArrayBuffer(file.rawFile);
  reader.onload = function () {
    var strBytes = new Uint8Array(reader.result).join();
  };
  reader.readAsBinaryString(blob);
}
