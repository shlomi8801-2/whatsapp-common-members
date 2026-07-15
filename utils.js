import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";
import QRCode from "qrcode";
import P from "pino";
import { sleep } from "@cacheable/utils";
import {connectToWhatsApp, con} from "./whatsapp.js"
import readline from 'node:readline';


export async function listGroups(){
    var groups = await con.sock.groupFetchAllParticipating()
    // console.log(Object.keys(groups))
    const output = {}
    for(var i=0;i<Object.keys(groups).length;++i){
        output[i] = {id:groups[Object.keys(groups)[i]].id, name:groups[Object.keys(groups)[i]].subject}
    }
    
    return output;
}
export async function input(question = ""){
    const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
    });
    rl.question(question, str => {
    const output = str;
    rl.close();
    });
return str;
}