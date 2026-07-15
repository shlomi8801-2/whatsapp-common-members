import {connectToWhatsApp, con} from "./whatsapp.js"
import { listGroups , input,listMembersOfGroup} from "./utils.js"



export async function showcommonmembers(){
    const groups = await listGroups();
    console.log(groups)
    for (var i=0;i<Object.keys(groups).length;i++)
        console.log(`${i}:${groups[i].name}`);
    var pick;
    while(!Object.keys(groups).includes(pick)){
        pick = await input("pick a group");
    }
    console.log(await listMembersOfGroup(groups[pick].id));
}