import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";
import QRCode from "qrcode";
import P from "pino";
import { sleep } from "@cacheable/utils";
import {connectToWhatsApp, con} from "./whatsapp.js"
import {showcommonmembers} from "./common_members.js"

function buildjid(phoneNumber, countryCode = "972", isDm = true) {
  return `${countryCode}${phoneNumber}@${isDm ? "s.whatsapp.net" : "g.us"}`;
}

(async () => {
    const sock =await connectToWhatsApp();
    while(con.state!=0){
        await sleep(100);
    }
    if (!sock){
        console.error("unable to connect to whatsapp")
        exit(1)
    }
    //after connection succeeded
    // for (let x=5;x>0;x--)
    // sock.sendMessage(buildjid("500000000"),{"text":"yes"});
    showcommonmembers();
})();

