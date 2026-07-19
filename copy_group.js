import { connectToWhatsApp, con } from "./whatsapp.js";
import { listGroups, input, listMembersOfGroup ,addMembers} from "./utils.js";
import { sleep } from "@cacheable/utils";


export async function copyGroup() {
  const groups = await listGroups();
  for (var i = 0; i < Object.keys(groups).length; i++)
    console.log(`${i}:${groups[i].name}`);
  var pick;
  while (!Object.keys(groups).includes(pick)) {
    pick = await input("pick a source");
  }
  const source = pick;
  pick = null;
  while (!Object.keys(groups).includes(pick)) {
    pick = await input("pick a dst");
  }
  const dst = pick;
  //run each group fetch members and add to dictionary like {phoneNumber:[<groups>]}

  var required = await listMembersOfGroup(groups[source].id);  
  var members = []
  var element;
  for (var x=0;x<required.length;x++){
  
    element = required[x];
    if (!element.admin)
    {
      // members.push(element.phoneNumber);
      await addMembers(groups[dst].id,[element.phoneNumber]);
      await sleep(10000);
    }
};

// console.log(members)
  console.log(groups[dst].id);
  // await addMembers(groups[dst].id,members)
  // console.log(required); 253 192
}
