/** @param {NS} ns */
export async function main(ns) {
  const pID = ns.run("radio.js");
  await ns.sleep(200);
  if (pID !== 0) {
    const [x, y] = [835, -7];
    ns.ui.moveTail(x, y, pID);
  }
}
