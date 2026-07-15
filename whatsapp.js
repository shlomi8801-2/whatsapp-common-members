import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";
import QRCode from "qrcode";
import P from "pino";
import { sleep } from "@cacheable/utils";
import {rmdirSync} from "fs"

class conObj {
    state = 2; // 'open' 0 | 'connecting' 1 | 'close' 2
    sock= null;
}
export const con = new conObj()

export async function connectToWhatsApp(tries = 5) {
    if(tries<=0){
        return null
    }
const authFolder = "auth"// auth is the name of the folder locally
  const { state, saveCreds } = await useMultiFileAuthState(authFolder); 
  const logger = P({ level: 'error' }) // "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  const sock = makeWASocket({
    auth: state,
    browser: ["Firefox (Linux)", "", ""],
    syncFullHistory: false,
    markOnlineOnConnect: false,
    logger:logger,
  });

  sock.ev.on("creds.update", saveCreds); // save the login data with saveCreds function
  
//   sock.ev.on("connection.update", async (update) => {
//     const { connection, lastDisconnect, qr } = update;
//     if (qr) {
//       console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
//     }
//   });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if(qr){
        console.log(await QRCode.toString(qr, { type: "terminal", small: true }));
    }
        
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
        return connectToWhatsApp(tries-1); // fixable by reconnecting
      }else{
            //delete the auth folder cuz we need to connect again
            await rmdirSync(authFolder,{ recursive: true });
            return connectToWhatsApp(tries-1);
      }
    } else if (connection === "open") {
      console.log("opened connection");
      con.state = 0; 
    }
  });
  con.sock = sock;
  return sock;
}
