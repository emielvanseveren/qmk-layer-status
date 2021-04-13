const hid = require('node-hid');

const vId = 0x445A; // Vendor ID
const pId = 0x2260; // Product ID

// Opening the first device that matches the vId and pId
const keyboard = new hid.HID(vId, pId);

keyboard.on('data', (data) => {
  console.log(data);
});
