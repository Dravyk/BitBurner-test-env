export async function main(ns: NS) {
  ns.disableLog("asleep");

  // Hook into game's overview
  const hook0 = globalThis["document"].getElementById("overview-extra-hook-0") as HTMLElement;
  const hook1 = globalThis["document"].getElementById("overview-extra-hook-1") as HTMLElement;

  const styleColor = "background: rgb(0, 0, 8);color: darkturquoise";
  hook0.style = styleColor;
  hook1.style = styleColor;

  // Callback to remove custom stats when script is killed
  ns.atExit(() => {
    hook0.innerHTML = "";
    hook1.innerHTML = "";
  });

  while (true) {
    try {
      const player = ns.getPlayer();
      const headers = []
      const values = [];

      headers.push("City:");
      values.push(player.city);

      headers.push("Entropy:");
      values.push(player.entropy);

      headers.push("Karma:");
      values.push(ns.format.number(ns.heart.break(), 3));

      headers.push("Kills:");
      values.push(player.numPeopleKilled);

      headers.push("Ram:");
      values.push(`${ns.format.ram(ns.getServerUsedRam("home"))}/${ns.format.ram(ns.getServerMaxRam("home"))}`);

      hook0.innerText = headers.join('\n');
      hook1.innerText = values.join('\n');

    }
    catch (error) {
      if (hook0 === null) {
        /**  The hooks are invalid. Bitburner was most likely closed and restarted.
          *  Print some info to the log, then spawn a new instance. */
        const scriptName = ns.self().filename;
        ns.print(`ERROR- ${String(error)}`);
        ns.printf(`Restarting ${scriptName}`);
        ns.spawn(scriptName, { spawnDelay: 5e3 });
      } else {
        // Something went wrong!
        // Print some info to the log and try again.
        ns.print(`Update Skipped: ${String(error)}`);
      }
    }

    await ns.asleep(1e3);
  }
}
