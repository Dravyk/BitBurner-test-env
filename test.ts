export async function main(ns: NS) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.clearLog();
  const pass = "309";
  const hintRange = [0, 1000];
  let details = {
    data: "",
    passwordHint: `The password is a number between ${hintRange[0]} and ${hintRange[1]}`,
    passwordLength: pass.length
  };
  const authenticate = async (ns: NS, hostname: string, password: string) => {
    await ns.sleep(200);
    ns.print(`Attempt ${++n}: ${password}`);
    if (Number(password) > Number(pass)) details.data = "Lower";
    else if (Number(password) < Number(pass)) details.data = "Higher";
    else return { success: true };
    ns.print(details.data);
    return { success: false };
  };
  let n = 0;
  ns.print(`AccountsManager_4.2 test`);
  /////////////////////////////////////////////////////////////////

  let [lowest, highest] = details.passwordHint.match(/\d+/g);

  let result;
  let password;
  let guess = Math.round((highest - lowest) / 2);
  while (true) {
    password = `${guess}`.padStart(details.passwordLength, '0');
    result = await authenticate(password);
    if (result.success) break;
    if (details.data === "Lower") {
      highest = guess;
      guess -= Math.round((highest - lowest) / 2);
    }
    else { // details.data = Higher
      lowest = guess;
      guess += Math.round((highest - lowest) / 2);
    }
  }

  //////////////////////////////////////////////////////////////////
  ns.print(`\npassword = ${password} in ${n} attempts`);
}
