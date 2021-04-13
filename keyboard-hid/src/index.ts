const hid = require('node-hid');
const fs = require('fs').promises;
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json()
})

const vId = 0x445A; // Vendor ID
const pId = 0x2260; // Product ID

// Opening the first device that matches the vId and pId
// qmk raw hid is always interface 1.

// lets first check if the device exists using the vid and pid.
const device = new hid.HID(vId, pId);
if (device) {
  logger.info(device);
  logger.info('Device found');
}

// https://github.com/qmk/qmk_firmware/blob/master/tmk_core/protocol/usb_descriptor.h#L151
const keyboard = new hid.HID('/dev/hidraw1');
const PATH = '../state/layer';

keyboard.on('data', async (data: Buffer) => {
  const val = data[0] + data[1];
  let layer;

  switch (val) {
    case 0:
      layer = 'BASE';
      break;
    case 1:
      layer = 'GAMING';
      break;
    case 5:
    case 6:
      layer = 'FN';
      break;
    default:
      layer = 'UNKNOWN';
  }
  await fs.writeFile(PATH, layer);
});

keyboard.on('error', (err: Error) => {
  console.error(err);
});
