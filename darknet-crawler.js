/** @param {NS} ns */
export async function main(ns) {
  // Open any caches on this server
  ns.ls(ns.self().server, ".cache")
    .forEach((cache) => ns.dnet.openCache(cache));

  while (true) {
    // Get a list of all darknet hostnames directly connected to the current server
    const nearbyServers = ns.dnet.probe();

    // Attempt to authenticate with each of the nearby servers, and spread this script to them
    for (const hostname of nearbyServers) {
      const details = ns.dnet.getServerAuthDetails(hostname);
      await ns.asleep(5000);
      const authenticationSuccessful = await serverSolver(ns, hostname, details);
      if (!authenticationSuccessful) {
        continue; // If we failed to auth, just move on to the next server
      }
      if (ns.dnet.getServerAuthDetails(hostname).hasSession) {
        // If we have successfully authenticated, we can now copy and run this script on the target server
        ns.scp(ns.getScriptName(), hostname);
        ns.exec(ns.getScriptName(), hostname, {
          preventDuplicates: true, // This prevents running multiple copies of this script
        });
      }
    }

    // TODO: free up blocked ram on this server using ns.dnet.memoryReallocation

    // TODO: look for .cache files on this server and open them with ns.dnet.openCache

    // TODO: take advantage of the extra ram on darknet servers to run ns.dnet.phishingAttack calls for money

    await ns.asleep(200);
  }
}

/**
 * Attempts to authenticate with the specified server using the Darknet API.
 * @param {NS} ns  * @param {string} hostname
 *   the name of the server to attempt to authorize on
 * @param {ServerAuthDetails & {isOnline: boolean} details
 *   the details of the server. 
 */
export const serverSolver = async (ns, hostname, details) => {
  // Get key info about the server, so we know what kind it is and how to authenticate with it
  if (!details.isConnectedToCurrentServer || !details.isOnline) {
    // If the server isn't connected or is offline, we can't authenticate
    return false;
  }
  // If you are already authenticated to that server with this script, you don't need to do it again
  if (details.hasSession) {
    return true;
  }

  const authFail = (hostname) => {
    const details = ns.dnet.getServerAuthDetails(hostname);
    if (details.isOnline && details.isConnectedToCurrentServer) {
      ns.tprintf(`

Failed to Authenticate
Model: ${details.modelId}
Format: ${details.passwordFormat}
Length: ${details.passwordLength}
Hint: ${details.passwordHint}
Data: ${details.data}
Online: ${details.isOnline}
Connected: ${details.isConnectedToCurrentServer}`
      );
    }
  }

  switch (details.modelId) {
    case "110100100": {
      // Convert binary to ASCII in data
      const ret = await authenticateBinary2Ascii(ns, hostname, details.data);
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "2G_cellular": {
      // TODO: I spent a while on it, but that's not right
      //       I thought about it for some time, but that is not the password
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "AccountsManager_4.2": {
      // Password range in hint
      const ret = await authenticateParseRangeFromHint(ns, hostname, details);
      if (!ret) authFail(details);
      return ret;
    }
    case "BellaCuore": {
      // Convert roman numerals or password in given range of roman numerals
      const ret = await authenticateWithRomanNumerals(ns, hostname, details);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "BigMo%od": {
      // TODO: (password % n) % (n % 32)
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "CloudBlare(tm)": {
      // Parse numbers from data in order
      const ret = await authenticateParseFromData(ns, hostname, details.data);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "DeepGreen": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "DeskMemo_3.1": {
      // Parse numbers from hint in order
      const ret = await authenticateParseFromData(ns, hostname, details.passwordHint);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "EuroZone Free": {
      // TODO: My favorite EU country
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "Factori-Os": {
      // TODO: Is divisible by ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "FreshInstall_1.0": {
      // Use a default password
      const ret = await authenticateWithDefaultPassword(ns, hostname, details);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "KingOfTheHill": {
      // TODO: Ascend the highest mountain!
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "Laika4": {
      // Dog names for password
      const ret = await authenticateWithDogNames(ns, hostname, details.passwordLength);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "MathML": {
      // TODO: The password is the evaluation of the expression in data
      // Example 1: 67 * 78 + ( 97 + 77 ) / 13 / ( 62 + 59 ) + 64
      // Example 2: 90 ➕ 48 ҳ ( 96 ҳ 47 ) ҳ 74 ҳ 66
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "NIL": {
      // TODO: yes, yesn't in data
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "OctantVoxel": {
      // Base conversion
      const ret = await authenticateWithBaseConversion(ns, hostname, details.data);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "OpenWebAccessPoint": {
      // TODO: heart.bleed? for "Authentification Successful: xxxx" message
      const ret = await authenticateFromHeartbleed(ns, hostname);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "OrdoXenos": {
      // TODO: XOR mask encrypted password with mask in data
      // Example: _`w.;00010111 00000001 00000100 00010110
      // test: _=01011111 ,`=01100000 ,w=01110111 ,.=00101110
      // xored:    48 61 73 28 = Has(
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "PHP 5.4": {
      // Sorted password is in data
      const ret = await authenticateUnsortFromData(ns, hostname, details);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "Pr0verFl0": {
      // Overflow password by 2x length
      const ret = await authenticatePasswordOverflow(ns, hostname, details.passwordLength);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "PrimeTime 2": {
      // The password is the largest prime factor of number in details.data
      const ret = await authenticateWithHighestPrime(ns, hostname, details.data);
      if (!ret) authFail(hostname);
      return ret;
    }
    case "RateMyPix.Auth": {
      // TODO: 🌶️🌶️🌶️🌶️🌶️ Make it spicy!
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "TopPass": {
      // TODO: It's a common password
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "ZeroLogon": {
      // No password
      const ret = await authenticateWithNoPassword(ns, hostname);
      if (!ret) authFail(hostname);
      return ret;
    }
    /*case "": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
    case "(The Labyrinth)": {
      // TODO: X marks the spot; there are 7 labs
      // "!!the:masterwork:of:daedalus<5999>!!"
      // "!!the:masterwork:of:daedalus<6293>!!"
      const nums = 6293;
      const ret = await ns.dnet.authenticate(hostname, `!!the:masterwork:of:daedalus<${nums}>!!`);
      if (!ret) authFail(hostname);
      return ret;
    }
    default:
      ns.tprint(`

Unhandled Model: ${details.modelId}`
      );
      return false;
  }
  // TODO: get recent server logs with `await ns.dnet.heartbleed(hostname)` for more detailed logging on failed auth attempts
};

/**
 * Attempts to authenticate with provided list of passwords.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {string[]} passwords list of passwords to try.
 */
const authenticate = async (ns, hostname, passwords) => {
  let result;
  for (const password of passwords) {
    result = await ns.dnet.authenticate(hostname, password);
    if (result.success) break;
  }
  return result;
}

/**
 * Authenticates on 'ZeroLogon' type servers,
 *   which always have an empty password.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 */
const authenticateWithNoPassword = async (ns, hostname) => {
  const result = await ns.dnet.authenticate(hostname, "");
  // TODO: store discovered passwords somewhere safe, in case we need them later
  return result.success;
};

/**
 * Authenticates on 'FreshInstall_1.0' type servers,
 *   which always have a default password.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails & {isOnline: boolean} details
 *   the details of the server.
 */
const authenticateWithDefaultPassword = async (ns, hostname, details) => {
  let passwords;
  if (details.passwordFormat === "numeric") {
    passwords = ["0000", "12345"];
  }
  else if (details.passwordFormat === "alphabetic") {
    passwords = ["admin", "password"];
  }
  else {
    return { success: false };
  }
  const result = await ns.dnet.authenticate(hostname, passwords
    .filter((p) => p.length === details.passwordLength)[0]
  );
  return result.success;
};

/**
 * Authenticates on 'Laika4' type servers,
 *   which always have a dog's name password.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {number} passwordLength the length of the password.
 */
const authenticateWithDogNames = async (ns, hostname, passwordLength) => {
  const passwords = ["max", "fido", "spot", "rover"]
    .filter((p) => p.length === passwordLength);
  const result = await authenticate(ns, hostname, passwords);
  return result.success;
};

/**
 * Authenticates on 'CloudBlare(tm)' & 'DeskMemo_3.1' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {string} data the data to parse numbers from.
 */
const authenticateParseFromData = async (ns, hostname, data) => {
  let password = "";
  for (const char of data) {
    if (Number(char) >= 0 && Number(char) <= 9) {
      password += char;
    }
  }
  const result = await ns.dnet.authenticate(hostname, password.trim());
  return result.success;
};

/**
 * Authenticates on 'PHP_5.4' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails & {isOnline: boolean} details
 *   the details of the server.
 */
const authenticateUnsortFromData = async (ns, hostname, details) => {
  const data = details.data;
  let passwords = [];
  switch (details.passwordLength) {
    case 1:
      passwords = [data];
      break;
    case 2:
      passwords = [
        data[0] + data[1],
        data[1] + data[0],
      ];
      break;
    default:
      passwords = [
        ...((array = data.split("")) => {
          const length = array.length;
          const permutations = [array.slice()];
          const c = new Array(length).fill(0);
          let i = 1, k, p;

          while (i < length) {
            if (c[i] < i) {
              k = i % 2 && c[i];
              p = array[i];
              array[i] = array[k];
              array[k] = p;
              ++c[i];
              i = 1;
              permutations.push(array.slice());
            }
            else {
              c[i] = 0;
              ++i;
            }
          }

          // Purge any duplicate permutations and merge inner arrays
          const map = new Map();
          permutations.forEach((x) => map.set(JSON.stringify(x), x.join("")));

          return map.values();
        })()
      ];
  }

  const result = await authenticate(ns, hostname, passwords);
  return result.success;
};

/**
 * Authenticates on 'Pr0verFl0' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {number} length of the password buffer.
 */
const authenticatePasswordOverflow = async (ns, hostname, length) => {
  const password = "11".repeat(length);
  const result = await ns.dnet.authenticate(hostname, password);
  return result.success;
};

/**
 * Authenticates on 'BellaCuore' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails} details the details of the server.
 */
const authenticateWithRomanNumerals = async (ns, hostname, details) => {
  const values = details.data.split(',');
  if (values.length === 1) {
    // Hint: The password is the value of the number 'CCCXLIII'
    // Data: CCCXLIII
    const password = convertRoman(values[0]);
    const result = await ns.dnet.authenticate(hostname, password);
    return result.success;
  }
  else {
    // Hint: The password is between 'CCC' and 'CDXXXII'
    // Data: CCC,CDXXXII
    // Hint: The password is between 'nulla' and 'DCCXIX'
    // Data: nulla,DCCXIX
    let [lowest, highest] = [convertRoman(values[0]), convertRoman(values[1])];
    let guess = Math.round((highest - lowest) / 2);
    let result;
    while (true) {
      const password = `${guess}`.padStart(details.passwordLength, '0');
      result = await ns.dnet.authenticate(hostname, password);
      if (result.success) break;
      let log;
      while (!log) {
        log = (await ns.dnet.heartbleed(hostname)).logs[0];
      }
      if (log.includes("ALTUS")) {
        highest = guess;
        guess -= Math.round((highest - lowest) / 2);
      }
      else { // Higher
        lowest = guess;
        guess += Math.round((highest - lowest) / 2);
      }
    }
    return result.success;
  }
};

const convertRoman = (value) => {
  if (value === "nulla") return 0;
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let ret = 0;
  for (let i = 0; i < value.length; ++i) {
    if (i === value.length - 1 || (roman[value[i]] >= roman[value[i + 1]])) {
      ret += roman[value[i]];
    }
    else {
      ret -= roman[value[i]];
    }
  }
  return ret;
};

/**
 * Authenticates on 'OctantVoxel' type servers 
 * @param {NS} ns
 * @param {string} hostname the name of the server to attem t to authorize on.
 * @param {string} data the details.data of the server.
 */
const authenticateWithBaseConversion = async (ns, hostname, data) => {
  const [base, value] = data.split(',');
  const password = baseConvert(base, value);

  const result = await ns.dnet.authenticate(hostname, password);
  return result.success;
};

/**
 * Authenticates on 'AccountsManager 4.2' type servers 
 * @param {NS} ns
 * @param {string} hostname the name of the server to attem t to authorize on.
 * @param {ServerAuthDetails} details the det ils of the server.
 */
const authenticateParseRangeFromHint = async (ns, hostname, details) => {
  let [lowest, highest] = details.passwordHint.match(/\d+/g);
  let guess = Math.round((highest - lowest) / 2);
  let result;
  while (true) {
    const password = `${guess}`.padStart(details.passwordLength, '0');
    result = await ns.dnet.authenticate(hostname, password);
    if (result.success) break;
    let log;
    while (!log) {
      log = (await ns.dnet.heartbleed(hostname)).logs[0];
    }
    if (log.includes("Lower")) {
      highest = guess;
      guess -= Math.round((highest - lowest) / 2);
    }
    else { // Higher
      lowest = guess;
      guess += Math.round((highest - lowest) / 2);
    }
  }
  return result.success;
};

/**
 * Authenticates on 'OpenWebAccessP int' type servers 
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 */
const authenticateFromHeartbleed = async (ns, hostname) => {
  let message;
  while (true) {
    const bled = await ns.dnet.heartbleed(hostname, { peek: true });
    if (!bled.isConnectedToCurrentServer) return { success: false };
    if (bled.success) {
      message = bled.logs.filter((log) => log.includes("successful"));
      if (message[0]) break;
    }
    await ns.sleep(1e3);
  }
  const result = await authenticateParseFromData(ns, hostname, message[0]);
  return result.success;
};

/**
 * Authenticates on 'PrimeTime 2' type servers 
 * @param {NS} ns
 * @param {string} hostname the name of the server to attem t to authorize on.
 * @param {string} data the details. ata of the server.
 */
const authenticateWithHighestPrime = async (ns, hostname, data) => {
  let num = Number(data);
  let maxPrime;

  // Check for factors of 2
  while (num % 2 === 0) {
    maxPrime = 2;
    num >>= 1;
  }

  // Check for factors of 3
  while (num % 3 === 0) {
    maxPrime = 3;
    num /= 3;
  }

  // Check for odd factors starting from 5 and 
  // incrementing by 6 (i and i+2)
  for (let i = 5; i * i <= num; i += 6) {
    while (num % i === 0) {
      maxPrime = i;
      num /= i;
    }
    while (num % (i + 2) === 0) {
      maxPrime = i + 2;
      num /= (i + 2);
    }
  }

  // If num is still greater than 4, it is a 
  // prime number
  if (num > 4)
    maxPrime = num;

  const result = await ns.dnet.authenticate(hostname, maxPrime);
  return result.success;
};

/**
 * Authenticates on '110100100' type servers 
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {string} data the details.data of the server.
 */
const authenticateBinary2Ascii = async (ns, hostname, data) => {
  let password = "";
  data.split(' ').forEach((bin) => { password += String.fromCharCode(baseConvert(2, bin)) });

  const result = await ns.dnet.authenticate(hostname, password);
  return result.success;
};

const baseConvert = (base, value) => {
  // TODO: convert fractional bases
  // Hint: the password is the base 3.8 number 102320.323011 in base 10
  // Data: 3.8,102320.323011
  let password = 0;
  for (let i = 0, j = value.length - 1; i < value.length; ++i, --j) {
    const char = value.charCodeAt(j);
    const digit = char > 64 ? char - 55 : Number(value[j]);
    password += digit * Math.pow(base, i);
  }
  return password;
};

const getPrimesList = (limit) => {
  /* Mark the composites */
  // Special case for 0 & 1
  let mark = [-1, -1];
  // Set k=1. Loop until k >= sqrt(n)
  for (let k = 1, m = 0; k <= Math.sqrt(limit) + 1; k = m) {
    // Find first non-composite in list > k
    for (m = k + 1; m < limit; ++m) {
      if (!mark[m]) break;
    }
    // Mark the non-primes
    for (let i = m * 2; i < limit; i += m) {
      mark[i] = -1;
    }
  }
  let primeList = [];
  // Reverse load primeList
  for (let i = limit - 1; i > 0; --i) {
    // All unmarked numbers are prime
    if (!mark[i]) primeList.push(i);
  }
  return primeList;
};

// This lets you tab-complete putting "--tail" on the run command so you can see the script logs as it runs
export function autocomplete(data) {
  return ["--tail"];
}
