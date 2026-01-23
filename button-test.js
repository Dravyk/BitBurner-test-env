/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 115);

  const doc = globalThis["document"];

  globalThis.state = false;

  const bbStyle = React.createElement("style", { type: "text/css" }, `
.btn {
  background-color: ${ns.ui.getTheme()["button"]};
  border: 1px solid ${ns.ui.getTheme()["well"]};
  color: ${ns.ui.getTheme()["primary"]};
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
  border: 1px solid ${ns.ui.getTheme()["int"]};
}
.btn:hover {
  background-color: ${ns.ui.getTheme()["backgroundsecondary"]}; 
}`
  );

  const rippleStyle = React.createElement("style", { type: "text/css" }, `
:root {
  --clickX: 0;
  --clickY: 0;
}
.ripple {
  border: none;
  border-radius: 2px;
  padding: 12px 18px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  background-color: #2196f3;
  box-shadow: 0 0 4px #999;
  outline: none;

  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #47a7f5 radial-gradient(circle at 50% 50%, transparent 1%, #47a7f5 1%) center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}`
  );

  ns.printRaw(React.createElement("div", {},
    React.createElement("span", {}, rippleStyle,
      React.createElement("button", {
        className: "ripple", onClick: (e) => {
          const [x, y] = [e.clientX, e.clientY];
          console.clear();
          //doc.getElementById("btn-test1").innerText = `${target}, ${x}, ${y}`;

          //console.log(e);
          const style = doc.documentElement.style;
          style.setProperty("--clickX", x);
          style.setProperty("--clickY", y);
          console.log(`client(x, y):(${x}, ${y})\nclick(x, y):(${style.getPropertyValue("--clickX")}, ${style.getPropertyValue("--clickY")})`)
        }
      }, "Ripple"),
    ),
    React.createElement("span", {}, bbStyle,
      React.createElement("button", {
        className: "btn", id: "btn-test1", onClick: () => {
          globalThis.state = !globalThis.state;
          doc.getElementById("btn-test1").innerText = globalThis.state ? "Stop" : "Play";
        }
      }, "Play")),
  ));
}

// https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
