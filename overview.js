import { formatTime } from "lib/functions";

/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("asleep");

  const doc = globalThis["document"];

  /** @type {Player} */
  const player = getPlayerObject();
  const home = player.getHomeComputer();
  //console.clear();
  //console.log(player);

  // Grab current bitnode data
  const bnCurrent = player.bitNodeN;
  const bnLevel = (player.sourceFiles.get(bnCurrent) ?? 0) + 1;
  const bnStart = player.lastNodeReset;

  // Create element and hook for bitnode info
  let bnHook1 = doc.getElementById("overview-bn-hook-1");
  if (bnHook1 === null) {
    const moneyEl = doc.getElementById("overview-money-hook").parentElement.parentElement;
    const bnEl = moneyEl.cloneNode(true);
    bnEl.querySelectorAll("p").forEach((el, i) => el.id = "overview-bn-hook-" + i);
    const bnHook0 = bnEl.querySelector("#overview-bn-hook-0");
    bnHook1 = bnEl.querySelector("#overview-bn-hook-1");
    const styleColor = `color: rgb(140, 160, 180)`;
    bnHook0.style = styleColor;
    bnHook1.style = styleColor;
    bnHook0.innerText = `BitNode ${bnCurrent}.${bnLevel}`;
    moneyEl.parentElement.insertBefore(bnEl, moneyEl.parentElement.firstChild);
  }

  // Hook into game's overview
  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");
  const styleColor = "background: rgb(0, 8, 8);color: rgb(0, 200, 200)";
  hook0.style = styleColor;
  hook1.style = styleColor;

  // Callback to remove custom stats when script is killed
  ns.atExit(() => {
    hook0.innerHTML = "";
    hook1.innerHTML = "";
    bnHook1.parentElement.parentElement.parentElement.removeChild(bnHook1.parentElement.parentElement);
  });

  // Set overview headers
  try {
    hook0.innerText = `City:
Entropy:
Karma:
Kills:
Cores:
Ram:`;
    //BlackOps:`;
  }
  catch (err) {
    ns.print(`ERROR- ${String(err)}`);
  }

  while (true) {
    const values = [];
    // City
    values.push(player.city);
    // Entropy
    values.push(player.entropy);
    // Karma
    values.push(ns.format.number(player.karma, 3));
    // Kills
    values.push(player.numPeopleKilled);
    // Cores
    values.push(`${home.cpuCores}`);
    // Ram
    values.push(`${ns.format.ram(home.ramUsed)}/${ns.format.ram(home.maxRam, 0)}`);
    // BlackOps
    //values.push(`${player.numBlackOpsComplete ?? 0} / 21`);

    try {
      hook1.innerText = values.join('\n');
      bnHook1.innerText = formatTime(Date.now() - bnStart, true).padStart(12, '\xa0');
    }
    catch (err) {
      if (hook1 === null) {
        // The hooks are invalid. Bitburner was most likely closed and restarted.
        ns.print(`ERROR- ${String(err)}`);
      } else {
        // Something went wrong!
        // Print some info to the log and try again.
        ns.print(`Update Skipped: ${String(err)}`);
      }
    }

    await ns.asleep(1e3);
  }
}

function getPlayerObject() {
  if (!globalThis.webpackChunkbitburner) return;
  if (!globalThis.webpackRequire) {
    globalThis.webpackChunkbitburner.push([[-1], {}, (w) => (globalThis.webpackRequire = w)]);
  }
  for (const moduleId of Object.keys(globalThis.webpackRequire.m)) {
    const module = globalThis.webpackRequire(moduleId);
    if (!module) continue;
    for (const value of Object.values(module)) {
      if (value && value.bitNodeN) return value;
    }
  }
}
