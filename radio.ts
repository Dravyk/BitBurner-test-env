globalThis.STATIONS = [
  ["Cool FM - Trance Elektro", "https://mediagw.e-tiger.net/stream/zc14"],
  ["Bunker TV", "https://bunkertv.org:8000/bunkertv"],
  ["Deep Dance Radio", "https://cast1.torontocast.com:2205/stream"],
  ["Synthwave City FM", "https://synthwave-rex.radioca.st/stream"],
  ["96.5 WKLH", "https://live.amperwave.net/direct/saga-wklhfmmp3-ibc2"],
  ["Classic Rock", "https://netradio.classicfm.dk/classicrock"],
  ["Chilltrax", "https://streamssl.chilltrax.com/stream/1/"],
  ["Horrorsynth", "https://stream.nightride.fm/horrorsynth.m4a"],
  ["Rekt", "https://stream.nightride.fm/rekt.m4a"],
  ["Nightride", "https://stream.nightride.fm/nightride.m4a"],
  ["Rektory", "https://stream.nightride.fm/rektory.m4a"],
  ["Chillsynth", "https://stream.nightride.fm/chillsynth.m4a"],
  ["Spacesynth", "https://stream.nightride.fm/spacesynth.m4a"],
  ["Darksynth", "https://stream.nightride.fm/darksynth.m4a"],
  ["EBSM", "https://stream.nightride.fm/ebsm.m4a"],
  ["Datawave", "https://stream.nightride.fm/datawave.m4a"],
];
globalThis.musicSource = 0;
globalThis.musicPlaying = false;

export async function main(ns: NS) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(250, 55);
  await ns.asleep(1e3);

  const doc = globalThis["document"];

  globalThis.tailWin = Array.prototype.slice.call(doc
    .getElementsByTagName("h6"))
    .filter((el) => el.textContent.trim() === ns.getScriptName())[0];

  const radio = React.createElement("div", { id: "radio" },
    React.createElement("span", { class: "controls" },
      React.createElement('a', {
        onClick: () => {
          globalThis.musicPlaying = !globalThis.musicPlaying;
          doc.getElementById("radioplayer")[
            globalThis.musicPlaying ? "play" : "pause"
          ]();
        }
      }, " [play]"
      ),
      React.createElement('a', {
        onClick: () => {
          const rPlayer = doc.getElementById("radioplayer");
          if (rPlayer.volume < 1) rPlayer.volume += 0.1;
        }
      }, " [vol up]"),
      React.createElement('a', {
        onClick: () => {
          const rPlayer = doc.getElementById("radioplayer");
          if (rPlayer.volume > 0) rPlayer.volume -= 0.1;
        }
      }, " [vol down]"),
      React.createElement('a', {
        onClick: () => {
          ++globalThis.musicSource;
          doc.getElementById("radioplayer").src = globalThis.STATIONS[
            globalThis.musicSource % globalThis.STATIONS.length
          ][1];
          doc.getElementById("radioplayer")[
            globalThis.musicPlaying ? "play" : "pause"
          ]();
          doc.getElementById("musicTitle").innerText = ' ' + globalThis.STATIONS[
            globalThis.musicSource % globalThis.STATIONS.length
          ][0];
        }
      }, " [next]"),
    ),
    React.createElement("audio", {
      id: "radioplayer", src: `${globalThis.STATIONS[0][1]}`
    }),
  );

  ns.printRaw(radio);
  //doc.getElementById("radioplayer").volume = 0.5;

  ns.ui.setTailTitle(React.createElement("font",
    { color: `${ns.ui.getTheme()["cha"]}` },
    React.createElement("span", {
      id: "musicTitle", class: "MuiTypography-root MuiTypography-body1"
    }, ` ${globalThis.STATIONS[0][0].trim()}`))
  );
}
/*
<div id="radio">
  <style type="text/css">
    .controls {
      display: inline-block;
      overflow: hidden;
    }
    .marquee {
      display: inline-block;
      width: 164px;
      overflow: hidden;
    }
    .marquee text {
      display: flex;
      animation: marquee 10s linear infinite;
  }
    @keyframes marquee {
      0% { transform: translate(0, 0); }
      50% { transform: translate(-100%, 0); }
    }
  </style>
  <font
    color="${ns.ui.getTheme()["cha"]}"
    family=
    >
    <span class="controls">
    <a onclick='{
      globalThis.musicPlaying = !globalThis.musicPlaying;
      document.getElementById("radioplayer")[
        globalThis.musicPlaying ? "play" : "pause"
      ]();
    }'>
       ⏯
    </a>
    <a onclick='{
      const rPlayer = document.getElementById("radioplayer");
      if (rPlayer.volume > 0) rPlayer.volume -= 0.1;
    }'>
      🔽
    </a>
    <a onclick='{
      const rPlayer = document.getElementById("radioplayer");
      if (rPlayer.volume < 1) rPlayer.volume += 0.1;
    }'>
      🔼
    </a>
    <a onclick='{
      ++globalThis.musicSource;
      document.getElementById("radioplayer").src=globalThis.STATIONS[
        globalThis.musicSource % globalThis.STATIONS.length
      ][1];
      document.getElementById("radioplayer")[
        globalThis.musicPlaying ? "play" : "pause"
      ]();
      document.getElementById("musicTitle").innerText=" " + globalThis.STATIONS[
        globalThis.musicSource % globalThis.STATIONS.length
      ][0];
    }'>
      ⏭
    </a>
    </span>
    <audio id="radioplayer" src=${globalThis.STATIONS[0][1]}>
    </audio>
    <span class="marquee">
      <text class="MuiTypography-root MuiTypography-body1" id="musicTitle">
         ${globalThis.STATIONS[0][0].trim()}
      </text>
    </span>
  </font>
</div>
*/
