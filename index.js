//credit https://whiskeysockets-baileys-94.mintlify.app/quickstart
import {makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import QRCode from "qrcode";
async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    auth: state,
    browser: ["Firefox (Linux)", "", ""],

  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
  const {connection, lastDisconnect, qr } = update
  // on a qr event, the connection and lastDisconnect fields will be empty

  // In prod, send this string to your frontend then generate the QR there
  if (qr) {
    // as an example, this prints the qr code to the terminal
    console.log(await QRCode.toString(qr, {type:'terminal',small:true}))
  }
})
return sock;
}
(async () => {
  
const sock = await connectToWhatsApp();

sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  
  if (connection === 'close') {
    const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
    console.log('connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect)
    
    // Reconnect if not logged out
    if (shouldReconnect) {
      connectToWhatsApp()
    }
  } else if (connection === 'open') {
    console.log('opened connection')
  }
})

})();
