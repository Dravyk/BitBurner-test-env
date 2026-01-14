export async function main(ns: NS) {
  ns.ui.openTail();
  const pass = "309";
  const hintRange = [0, 1000];
  let details = {
    data: "",
    passwordHint: `The password is a number between ${hintRange[0]} and ${hintRange[1]}`,
    passwordLength: pass.length
  };
  const auth = (password: string): boolean => {
    if (Number(password) > Number(pass)) details.data = "Lower";
    else if (Number(password) < Number(pass)) details.data = "Higher";
    else return true;
    return false;
  };
  ns.print(`AccountsManager_4.2 test`);
  /////////////////////////////////////////////////////////////////

  let [lowest, highest] = details.passwordHint.match(/\d+/g);

  let i = 1;
  let result;
  let password;
  let guess = Math.round((highest - lowest) / 2);
  while (true) {
    password = `${guess}`.padStart(details.passwordLength, '0');
    result = auth(password);
    if (result) break;
    if (details.data === "Higher") {
      lowest = guess;
      guess += Math.ceil((highest - guess) / 2);
    }
    else { // details.data = Lower
      highest = guess;
      guess -= Math.floor((guess - lowest) / 2);
    }
    await ns.sleep(1e3);
    ++i;
  }

  //////////////////////////////////////////////////////////////////
  ns.print(`\npassword = ${password} in ${i} guesses`);
}
