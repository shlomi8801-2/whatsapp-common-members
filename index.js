import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";
import QRCode from "qrcode";
import P from "pino";
import { sleep } from "@cacheable/utils";

var connectionState = 2; // 'open' 0 | 'connecting' 1 | 'close' 2

async function connectToWhatsApp(tries = 5) {
    if(tries<=0){
        return null
    }
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({
    auth: state,
    browser: ["Firefox (Linux)", "", ""],
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  sock.ev.on("creds.update", saveCreds); // save the login data with saveCreds function
  
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to",
        lastDisconnect?.error,
        ", reconnecting:",
        shouldReconnect,
      );

      // Reconnect if not logged out
      if (shouldReconnect) {
        return connectToWhatsApp(tries-1);
      }
    } else if (connection === "open") {
      console.log("opened connection");
      connectionState = 0; 
    }
  });
  
  return sock;
}
function buildjid(phoneNumber, countryCode = "972", isDm = true) {
  return `${countryCode}${phoneNumber}@${isDm ? "s.whatsapp.net" : "g.us"}`;
}

(async () => {
    const sock =await connectToWhatsApp();
    while(connectionState!=0){
        await sleep(200);
    }
if(sock)
for (let x=5;x>0;x--)
sock.sendMessage(buildjid("500000000"),{"text":"yes"});
})();

