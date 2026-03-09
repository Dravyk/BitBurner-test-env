/** @param {NS} ns **/
export async function main(ns) {
  const doc = globalThis["document"];
  ns.disableLog("asleep");

  // Grab current bitnode data
  const resetInfo = ns.getResetInfo();
  const bnCurrent = resetInfo.currentNode;
  const bnLevel = (resetInfo.ownedSF.get(bnCurrent) ?? 0) + 1;
  const bnStart = resetInfo.lastNodeReset;

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
  const styleColor = "background: rgb(0, 0, 8);color: darkturquoise";
  hook0.style = styleColor;
  hook1.style = styleColor;

  // Callback to remove custom stats when script is killed
  ns.atExit(() => {
    hook0.innerHTML = "";
    hook1.innerHTML = "";
    bnHook1.parentElement.parentElement.parentElement.removeChild(bnHook1.parentElement.parentElement);
  });

  while (true) {
    const player = ns.getPlayer();
    const headers = []
    const values = [];

    headers.push("City:");
    values.push(player.city);

    headers.push("Entropy:");
    values.push(player.entropy);

    headers.push("Karma:");
    values.push(ns.format.number(player.karma, 3));

    headers.push("Kills:");
    values.push(player.numPeopleKilled);

    headers.push("Ram:");
    values.push(`${ns.format.ram(ns.getServer("home").ramUsed)}/${ns.format.ram(ns.getServer("home").maxRam, 0)}`);

    headers.push("Cores:");
    values.push(`${ns.getServer("home").cpuCores}`);

    try {
      hook0.innerText = headers.join('\n');
      hook1.innerText = values.join('\n');
      bnHook1.innerText = formatTime(Date.now() - bnStart).padStart(12, '\xa0');
    }
    catch (err) {
      if (hook0 === null) {
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

function formatTime(time) {
  const millisecondsPerSecond = 1000;
  const secondPerMinute = 60;
  const minutesPerHours = 60;
  const secondPerHours = secondPerMinute * minutesPerHours;
  const hoursPerDays = 24;
  const secondPerDay = secondPerHours * hoursPerDays;

  // Convert ms to seconds, since we only have second-level precision
  const totalSeconds = Math.trunc(time / millisecondsPerSecond);

  const days = Math.trunc(totalSeconds / secondPerDay);
  const secTruncDays = totalSeconds % secondPerDay;

  const hours = `${Math.trunc(secTruncDays / secondPerHours)}`;
  const secTruncHours = secTruncDays % secondPerHours;

  const minutes = `${Math.trunc(secTruncHours / secondPerMinute)}`;

  const seconds = `${secTruncHours % secondPerMinute}`;

  let res = "";
  let padHr = 1;
  let padMin = 1;
  let padSec = 1;

  let showDay = days > 0;
  let showHr = hours !== '0' || showDay;
  let showMin = minutes !== '0' || showHr;

  if (showDay) {
    res += `${days}:`;
    ++padHr;
  }
  if (showHr) {
    res += `${hours.padStart(padHr, '0')}:`;
    ++padMin;
  }
  if (showMin) {
    res += `${minutes.padStart(padMin, '0')}:`;
    ++padSec;
  }

  return res += `${seconds.padStart(padSec, '0')}`;
}
