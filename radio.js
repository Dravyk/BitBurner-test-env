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

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 100);

  const doc = globalThis["document"];

  const createButton = (id, text, onClick) => {
    return React.createElement('a', { id: id, onClick: onClick }, text);
  }

  globalThis.tailWin = Array.prototype.slice.call(doc
    .getElementsByTagName("h6"))
    .filter((el) => el.textContent.trim() === ns.getScriptName())[0];

  ns.printRaw(React.createElement("div", { id: "radio" },
    React.createElement("font",
      { color: `${ns.ui.getTheme()["cha"]}` },
      React.createElement("span", { class: "controls" },
        createButton("play-btn", " [play]", () => {
          globalThis.musicPlaying = !globalThis.musicPlaying;
          doc.getElementById("play-btn")
            .innerText = ` [${globalThis.musicPlaying ? "pause" : "play"}]`;
          doc.getElementById("radioplayer")[
            globalThis.musicPlaying ? "play" : "pause"
          ]();
        }),
        createButton("vol-u-btn", " [vol up]", () => {
          const rPlayer = doc.getElementById("radioplayer");
          if (rPlayer.volume < 1) rPlayer.volume += 0.1;
        }),
        createButton("vol-d-btn", " [vol down]", () => {
          const rPlayer = doc.getElementById("radioplayer");
          if (rPlayer.volume > 0) rPlayer.volume -= 0.1;
        }),
        createButton("mute-btn", " [mute]", () => {
          globalThis.musicMute = !globalThis.musicMute;
          doc.getElementById("mute-btn")
            .innerText = ` [${globalThis.musicMute ? "unmute" : "mute"}]`;
          doc.getElementById("radioplayer").muted = globalThis.musicMute;
        }),
        createButton("prev-btn", " [prev]", () => {
          globalThis.musicSource = (--globalThis.musicSource
            + globalThis.STATIONS.length)
            % globalThis.STATIONS.length;
          doc.getElementById("radioplayer").src = globalThis.STATIONS[
            globalThis.musicSource
          ][1];
          doc.getElementById("radioplayer")[
            globalThis.musicPlaying ? "play" : "pause"
          ]();
          doc.getElementById("musicTitle").innerText = ' ' + globalThis.STATIONS[
            globalThis.musicSource
          ][0];
        }),
        createButton("next-btn", " [next]", () => {
          globalThis.musicSource = ++globalThis.musicSource
            % globalThis.STATIONS.length;
          doc.getElementById("radioplayer").src = globalThis.STATIONS[
            globalThis.musicSource
          ][1];
          doc.getElementById("radioplayer")[
            globalThis.musicPlaying ? "play" : "pause"
          ]();
          doc.getElementById("musicTitle").innerText = ' ' + globalThis.STATIONS[
            globalThis.musicSource
          ][0];
        }),
      ),
      React.createElement("audio", {
        id: "radioplayer", src: `${globalThis.STATIONS[0][1]}`
      }),
    ),
  ));

  ns.ui.setTailTitle(React.createElement("div", { id: "title" },
    React.createElement("style", { type: "text/css" }, `
      .marquee {
        display: flex;
        width: 500px;
        overflow: hidden;
      }
      .marquee a {
        display: flex;
        animation: marquee 10s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translate(700%, 0); }
        100% { transform: translate(-100%, 0); }
      }`
    ),
    React.createElement("font",
      { color: `${ns.ui.getTheme()["cha"]}` },
      React.createElement("span", { class: "marquee" },
        React.createElement("a", {
          id: "musicTitle", class: "MuiTypography-root MuiTypography-body1"
        }, ` ${globalThis.STATIONS[0][0].trim()}`),
      ),
    ),
  ));

  await ns.asleep(200);
  doc.getElementById("radioplayer").volume = 0.1;
}
