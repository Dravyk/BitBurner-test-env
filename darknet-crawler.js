/** @param {NS} ns */
export async function main(ns) {
  // Open any caches on this server
  openAllCaches(ns);

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

  const authFail = (details) => ns.tprintf(`

Failed to Authenticate
Model: ${details.modelId}
Format: ${details.passwordFormat}
Length: ${details.passwordLength}
Hint: ${details.passwordHint}
Online: ${details.isOnline}`
  );

  switch (details.modelId) {
    case "ZeroLogon": {
      // No password
      const ret = authenticateWithNoPassword(ns, hostname);
      if (!ret) authFail(details);
      return ret;
    }
    case "FreshInstall_1.0": {
      // Use a default password
      const ret = authenticateWithDefaultPassword(ns, hostname, details);
      if (!ret) authFail(details);
      return ret;
    }
    case "CloudBlare(tm)": {
      // Parse numbers from data in order
      const ret = authenticateParseFromData(ns, hostname, details.data);
      if (!ret) authFail(details);
      return ret;
    }
    case "DeskMemo_3.1": {
      // Parse numbers from hint in order
      const ret = authenticateParseFromData(ns, hostname, details.passwordHint);
      if (!ret) authFail(details);
      return ret;
    }
    case "AccountsManager_4.2": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "Laika4": {
      // Dog names for password
      const ret = authenticateWithDogNames(ns, hostname, details);
      if (!ret) authFail(details);
      return ret;
    }
    case "NIL": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "OctantVoxel": {
      // Base conversion
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "PHP 5.4": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "ModuloTerm": {
      // Is divisible by ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "DeepGreen": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "BellaCuore": {
      // Convert roman numerals
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "RateMyPix.Auth": {
      // 🌶️🌶️🌶️🌶️🌶️ So spicy!
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "OpenWebAccessPoint": {
      // heart.bleed? for "Authentification Successful: xxxx" message
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    case "Pr0verFl0": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
      return ret;
    }
    /*case "": {
      // ?
      const ret = false;
      //if (!ret) authFail(details);
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
  let result;
  switch (details.passwordLength) {
    case 4: {
      if (details.passwordFormat === "numeric") {
        result = await ns.dnet.authenticate(hostname, "0000");
      }
      break;
    }
    case 5: {
      switch (details.passwordFormat) {
        case "alphabetic": {
          result = await ns.dnet.authenticate(hostname, "admin");
          break;
        }
        case "numeric": {
          result = await ns.dnet.authenticate(hostname, "12345");
        }
      }
      break;
    }
    case 8: {
      if (details.passwordFormat === "alphabetic") {
        result = await ns.dnet.authenticate(hostname, "password");
      }
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
 * @param {ServerAuthDetails & {isOnline: boolean} details
 *   the details of the server.
 */
const authenticateWithDogNames = async (ns, hostname, details) => {
  let result;
  switch (details.passwordLength) {
    case 4: {
      result = await ns.dnet.authenticate(hostname, "fido");
      if (!result) {
        result = await ns.dnet.authenticate(hostname, "spot");
      }
      break;
    }
    case 5: {
      //result = await ns.dnet.authenticate(hostname, "???");
    }
    default:
      result = { success: false };
  }
  return result.success;
};

/**
 * Authenticates on 'CloudBlare(tm)' and 'DeskMemo_3.1' type servers.
 * @param {NS} ns
 * @param {string} hostname the name of the server to attempt to authorize on.
 * @param {ServerAuthDetails & {isOnline: boolean} details
 *   the details of the server.
 */
const authenticateParseFromData = async (ns, hostname, data) => {
  let password = "";
  for (const char of data) {
    if (Number(char) >= 0 && Number(char) <= 9) {
      password += char;
    }
  }
  const result = await ns.dnet.authenticate(hostname, Number(password));
  return result.success;
};

/** @param {NS} ns */
const openAllCaches = (ns) => {
  ns.ls(ns.self().server, ".cache")
    .forEach((cache) => ns.dnet.openCache(cache));
}

// This lets you tab-complete putting "--tail" on the run command so you can see the script logs as it runs
export function autocomplete(data) {
  return ["--tail"];
}
