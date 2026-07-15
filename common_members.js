import { connectToWhatsApp, con } from "./whatsapp.js";
import { listGroups, input, listMembersOfGroup } from "./utils.js";
import { sleep } from "@cacheable/utils";


export async function showcommonmembers() {
  const groups = await listGroups();
  for (var i = 0; i < Object.keys(groups).length; i++)
    console.log(`${i}:${groups[i].name}`);
  var pick;
  while (!Object.keys(groups).includes(pick)) {
    pick = await input("pick a group");
  }
  //run each group fetch members and add to dictionary like {phoneNumber:[<groups>]}
  const required = await listMembersOfGroup(groups[pick].id);
  const output = {};
  required.forEach((user) => {
    output[user.phoneNumber] = [];
  });
  const keys = new Set(Object.keys(output));
  for (var groupidx = 0; groupidx < Object.keys(groups).length; groupidx++){
    const curr_participants = await listMembersOfGroup(groups[groupidx].id);
    const curr = keys.intersection(
      new Set(curr_participants.map((elem) => elem.phoneNumber)),
    );
    console.log("pushing "+groups[groupidx].name)
    await curr.forEach((userPhoneNumber) => {
      output[userPhoneNumber].push(groups[groupidx].name);
    });
    await sleep(5000); //for the rate limit
  };
  const users = Object.keys(output);
  for(var i=0;i<users.length;i++){
    if (output[users[i]].length <=1){
        delete output[users[i]]
    }
  }
  console.log(output);
}
