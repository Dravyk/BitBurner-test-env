/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 115);

  const doc = globalThis["document"];

  globalThis.state = false;

  const bbStyle = React.createElement("style", { type: "text/css" }, `
.button {
  background-color: ${ns.ui.getTheme()["button"]};
  border: 1px solid ${ns.ui.getTheme()["well"]};
  color: ${ns.ui.getTheme()["primary"]};
  padding: 8.5px 14px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-family: ${ns.ui.getStyles()["fontFamily"]};
  font-size: ${ns.ui.getStyles()["tailFontSize"] - 1.5}px;
  margin: 4px 2px;
  transition-duration: 0.25s;
  cursor: pointer;
}
.button:active {
  border: 1px solid ${ns.ui.getTheme()["cha"]};
}
.button:hover {
  background-color: ${ns.ui.getTheme()["backgroundsecondary"]}; 
}`
  );

  ns.printRaw(React.createElement("span", {},
    React.createElement("div", {}, bbStyle,
      React.createElement("button", {
        class: "button btn-test1", id: "btn-test1", onClick: () => {
          globalThis.state = !globalThis.state;
          doc.getElementById("btn-test1").innerText = globalThis.state ? "Stop" : "Play";
        }
      }, "Play"),
    ),
  ));
}

// https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
