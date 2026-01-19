export async function main(ns: NS) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.clearLog();
  let pass = "00";
  let sorted = "248";
  let details = {
    data: `Oops! I sorted the password ${sorted}`,
    passwordHint: `Password is between 0 and 100`,
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
  let key;
  const hostname = "darkweb";
while (Number(pass) < 100){
  ns.print(`AccountsManager_4.2`);
  /////////////////////////////////////////////////////////////////

  let [lowest, highest] = details.passwordHint.match(/\d+/g);
  let guess = Math.round((highest - lowest) / 2);
  let result;
  let password;
  while (true) {
    password = `${guess}`.padStart(details.passwordLength, '0');
    result = await authenticate(ns, hostname, password);
    if (result.success) break;
    if (details.data === "Lower") {
      highest = guess;
      guess -= Math.round((highest - lowest) / 2);
    }
    else { // data = Higher
      lowest = guess;
      guess += Math.round((highest - lowest) / 2);
    }
  }
  //////////////////////////////////////////////////////////////////
  ns.print(`password = ${key} in ${n} attempts`);
n=0
pass = `${Number(pass) + 1}`.padStart(2,'0')
}
}
