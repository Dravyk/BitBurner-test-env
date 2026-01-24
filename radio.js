globalThis.STATIONS = [
  //["Cool FM - Trance Elektro", "https://mediagw.e-tiger.net/stream/zc14"],
  ["96.5 WKLH", "https://live.amperwave.net/direct/saga-wklhfmmp3-ibc2"],
  ["Chillsynth", "https://stream.nightride.fm/chillsynth.m4a"],
  ["Darksynth", "https://stream.nightride.fm/darksynth.m4a"],
  ["Datawave", "https://stream.nightride.fm/datawave.m4a"],
  ["EBSM", "https://stream.nightride.fm/ebsm.m4a"],
  ["Horrorsynth", "https://stream.nightride.fm/horrorsynth.m4a"],
  ["Nightride", "https://stream.nightride.fm/nightride.m4a"],
  ["Rekt", "https://stream.nightride.fm/rekt.m4a"],
  ["Rektory", "https://stream.nightride.fm/rektory.m4a"],
  ["Spacesynth", "https://stream.nightride.fm/spacesynth.m4a"],
  //["Bunker TV", "https://bunkertv.org:8000/bunkertv"],
  //["Classic Rock", "https://netradio.classicfm.dk/classicrock"],
  //["Chilltrax", "https://streamssl.chilltrax.com/stream/1/"],
  //["Deep Dance Radio", "https://cast1.torontocast.com:2205/stream"],
  //["Synthwave City FM", "https://synthwave-rex.radioca.st/stream"],
];
globalThis.musicSource = 0;
globalThis.musicPlaying = false;
globalThis.musicMute = false;

const NetworkStates = {
  NETWORK_EMPTY: 0,     // Not yet initialized
  NETWORK_IDLE: 1,      // Resource active, but is not using the network
  NETWORK_LOADING: 2,   // Browser downloading data
  NETWORK_NO_SOURCE: 3, // No source found
};
const ReadyStates = {
  HAVE_NOTHING: 0,      // No information
  HAVE_METADATA: 1,     // Metadata loaded
  HAVE_CURRENT_DATA: 2, // Data is available, but not enough to play next frame
  HAVE_FUTURE_DATA: 3,  // Data for current and at least next frame available
  HAVE_ENOUGH_DATA: 4,  // Enough data available to start playing
};

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(470, 79); // steam: 470, 79 mozilla: 415, 74
  console.clear();

  const doc = globalThis["document"];

  const createButton = (id, text, onClick) => {
    return React.createElement("button", { className: `btn ${id}`, id: id, onClick: onClick }, text);
  }
  const setStation = () => {
    const rPlayer = doc.getElementById("radioplayer");
    rPlayer.src = globalThis.STATIONS[globalThis.musicSource][1];
    rPlayer[globalThis.musicPlaying ? "play" : "pause"]();
    doc.getElementById("music-title")
      .innerText = ' ' + globalThis.STATIONS[globalThis.musicSource][0].trim();
  };

  globalThis.tailWin = Array.prototype.slice.call(doc
    .getElementsByTagName("h6"))
    .filter((el) => el.textContent.trim() === ns.getScriptName())[0];

  ns.printRaw(React.createElement("div", { id: "radio" },
    React.createElement("style", { type: "text/css" }, `
      .btn {
        background-color: ${ns.ui.getTheme()["button"]};
        border: 1px solid ${ns.ui.getTheme()["well"]};
        color: ${ns.ui.getTheme()["cha"]};
        padding: 8.5px 14px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-family: ${ns.ui.getStyles()["fontFamily"]};
        font-size: ${ns.ui.getStyles()["tailFontSize" - 1.5]}px;
        margin: 4px 2px;
        transition-duration: 0.25s;
        cursor: pointer;
      }
      .btn:active {
        border: 1px solid ${ns.ui.getTheme()["cha"]};
      }
      .btn:hover {
        background-color: ${ns.ui.getTheme()["backgroundsecondary"]}; 
      }
    `),
    React.createElement("span", { className: "controls" },
      createButton("play-btn", "Play", (e) => {
        globalThis.musicPlaying = !globalThis.musicPlaying;
        e.currentTarget.innerText = globalThis.musicPlaying ? "Stop" : "Play";
        doc.getElementById("radioplayer")[
          globalThis.musicPlaying ? "play" : "pause"
        ]();
      }),
      createButton("vol-u-btn", "Vol Up", () => {
        const rPlayer = doc.getElementById("radioplayer");
        if (rPlayer.volume <= 0.95) rPlayer.volume += 0.05;
      }),
      createButton("vol-d-btn", "Vol Down", () => {
        const rPlayer = doc.getElementById("radioplayer");
        if (rPlayer.volume >= 0.05) rPlayer.volume -= 0.05;
      }),
      createButton("mute-btn", " Mute ", (e) => {
        globalThis.musicMute = !globalThis.musicMute;
        e.currentTarget.innerText = globalThis.musicMute ? "Unmute" : " Mute ";
        doc.getElementById("radioplayer").muted = globalThis.musicMute;
      }),
      createButton("prev-btn", "Prev", () => {
        globalThis.musicSource = (--globalThis.musicSource
          + globalThis.STATIONS.length)
          % globalThis.STATIONS.length;
        setStation();
      }),
      createButton("next-btn", "Next", () => {
        globalThis.musicSource = ++globalThis.musicSource
          % globalThis.STATIONS.length;
        setStation();
      }),
    ),
    React.createElement("audio", {
      id: "radioplayer", preload: "none", src: `${globalThis.STATIONS[0][1]}`,
      onAbort: () => {
        console.log("Media Aborted:");
      },
      onEnded: () => {
        console.log("Media Ended:");
      },
      onError: () => {
        console.log("Media Error:");
      },
      onStalled: () => {
        console.log("Media Stalled:");
      },
      onSuspend: () => {
        console.log("Media Suspended:");
      },
      onWaiting: () => {
        console.log("Media Buffering:");
      },
    }),
  ));

  ns.ui.setTailTitle(React.createElement("div", { id: "title" },
    React.createElement("style", { type: "text/css" }, `
      .marquee {
        color: ${ns.ui.getTheme()["cha"]};
        display: flex;
        font-family: ${ns.ui.getStyles()["fontFamily"]};
        font-size: ${ns.ui.getStyles()["tailFontSize"]}px;
        width: 500px;
        overflow: hidden;
      }
      .marquee a {
        display: flex;
        animation: marquee 10s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translate(500%, 0); }
        100% { transform: translate(-100%, 0); }
      }`
    ),
    React.createElement("span", { className: "marquee" },
      React.createElement("a", {
        id: "music-title", className: "MuiTypography-root MuiTypography-body1"
      }, ` ${globalThis.STATIONS[0][0].trim()}`),
    ),
  ));

  await ns.asleep(200);
  doc.getElementById("radioplayer").volume = 0.2;
}
