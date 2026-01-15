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

    await ns.asleep(5000);
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
Online: ${details.isOnline}
Connected: ${details.isConnectedToCurrentServer}`
      );
    }
  }

  switch (details.modelId) {
    case "110100100": {
      // TODO: 420, weed related?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    /*case "2G_cellular": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
    case "AccountsManager_4.2": {
      // Password range in hint
      const ret = await authenticateParseRangeFromHint(ns, hostname, details);
      if (!ret) authFail(details);
      return ret;
    }
    case "BellaCuore": {
      // Convert roman numerals
      const ret = await authenticateWithRomanNumerals(ns, hostname, details.data);
      if (!ret) authFail(hostname);
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
    /*case "EuroZone Free": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
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
    case "Laika4": {
      // Dog names for password
      const ret = await authenticateWithDogNames(
        ns, hostname, details.passwordLength
      );
      if (!ret) authFail(hostname);
      return ret;
    }
    /*case "MathML": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
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
    /*case "OrdoXenos": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
    case "PHP 5.4": {
      // TODO: Sorted password is in data
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    case "Pr0verFl0": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    /*case "PrimeTime 2": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
    case "RateMyPix.Auth": {
      // TODO: 🌶️🌶️🌶️🌶️🌶️ Make it spicy!
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }
    /*case "TopPass": {
      // TODO: ?
      const ret = false;
      //if (!ret) authFail(hostname);
      return ret;
    }*/
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
    default:
      ns.tprint(`

Unhandled Model: ${details.modelId}`
      );
      return false;
  }
  // TODO: get recent server logs with `await ns.dnet.heartbleed(hostname)` for more detailed logging on failed auth attempts
};

/**
* Attempts to authenticate with provided password,
* @param {NS} ns
* @param {string} hostname the name of the server to attempt to authorize on.
* @param {string} password to attempt to authenticate with.
* @param {number?} additionalMsec optional. The number of additional
*   milliseconds to add to the run time of the authentication request.
*   Default is 0.
* @returns a promise that resolves to a {@link DarknetResult } object.
*/
const authenticate = async (ns, hostname, password, additionalMsec = 0) => {
  let result = await ns.dnet.authenticate(hostname, password, additionalMsec);
  if (!result.success) {
    result = ns.dnet.connectToSession(hostname, password);
  }
  return result;
};

/**
 * Authenticates on 'ZeroLogon' type servers,
 *   which always have an empty password.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 */
const authenticateWithNoPassword = async (ns, hostname) => {
  let result = await authenticate(ns, hostname, "");
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
  let result;
  switch (details.passwordLength) {
    case 4: {
      if (details.passwordFormat === "numeric") {
        result = await authenticate(ns, hostname, "0000");
      }
      break;
    }
    case 5: {
      switch (details.passwordFormat) {
        case "alphabetic": {
          result = await authenticate(ns, hostname, "admin");
          break;
        }
        case "numeric": {
          result = await authenticate(ns, hostname, "12345");
          break;
        }
        default:
          result = { success: false };
      }
      break;
    }
    case 8: {
      if (details.passwordFormat === "alphabetic") {
        result = await authenticate(ns, hostname, "password");
      }
      break;
    }
    default:
      result = { success: false };
  }

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
  let result;
  switch (passwordLength) {
    case 3:
      result = await authenticate(ns, hostname, "max");
      break;
    case 4:
      result = await authenticate(ns, hostname, "fido");
      if (!result.success) {
        result = await authenticate(ns, hostname, "spot");
      }
      break;
    case 5:
      result = await authenticate(ns, hostname, "rover");
      break;
    default:
      result = { success: false };
  }
  return result.success;
};

/**
 * Authenticates on 'CloudBlare(tm)', 'DeskMemo_3.1' type servers.
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
  let result = await authenticate(ns, hostname, Number(password));
  return result.success;
};

/**
 * Authenticates on 'BellaCuore' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails} data the details.data of the server.
 */
const authenticateWithRomanNumerals = async (ns, hostname, data) => {
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let password = 0;
  for (let i = 0; i < data.length; ++i) {
    if (i === data.length - 1 || (roman[data[i]] >= roman[data[i + 1]])) {
      password += roman[data[i]];
    }
    else {
      password -= roman[data[i]];
    }
  }
  let result = await authenticate(ns, hostname, password);
  return result.success;
};

/**
 * Authenticates on 'OctantVoxel' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails} data the details.data of the server.
 */
const authenticateWithBaseConversion = async (ns, hostname, data) => {
  const [base, value] = data.split(',');

  let password = 0;
  for (let i = 0, j = value.length - 1; i < value.length; ++i, --j) {
    const char = value.charCodeAt(j);
    const digit = char > 64 ? char - 55 : Number(value[j]);
    password += digit * Math.pow(Number(base), i);
  }

  let result = await authenticate(ns, hostname, password);
  return result.success;
};

/**
 * Authenticates on 'AccountsManager_4.2' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails} details the details of the server.
 */
const authenticateParseRangeFromHint = async (ns, hostname, details) => {
  let [lowest, highest] = details.passwordHint.match(/\d+/g);
  let guess = Math.round((highest - lowest) / 2);

  let result;
  while (true) {
    const password = `${guess}`.padStart(details.passwordLength, '0');
    result = await authenticate(ns, hostname, password);
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

  return result.success;
};

/**
 * Authenticates on 'OpenWebAccessPoint' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 */
const authenticateFromHeartbleed = async (ns, hostname) => {
  let message;
  while (true) {
    const bled = await ns.dnet.heartbleed(hostname, { peek: true });
    if (!bled.isConnectedToCurrentServer) return { success: false };
    if (bled.success) {
      message = bled.logs.filter((log) => log.includes("Authentication successful"));
      if (message[0]) {
        break;
      }
    }
    await ns.sleep(1e3);
  }
  const result = await authenticateParseFromData(ns, hostname, message[0]);
  return result.success;
};

// This lets you tab-complete putting "--tail" on the run command so you can see the script logs as it runs
export function autocomplete(data) {
  return ["--tail"];
}
