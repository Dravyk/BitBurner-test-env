/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 100);

  const doc = globalThis["document"];

  const createButton = (id, text, onClick) => {
    return React.createElement("button", {
      class: `button ${id}`, id: id, onClick: onClick
    }, text);
  }

  globalThis.state = false;

  // test button
  ns.printRaw(React.createElement("div", { class: "test" },
    React.createElement("style", { type: "text/css" }, `
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
      }
    `),
    createButton("btn-test1", "Play", () => {
      globalThis.state = !globalThis.state;
      doc.getElementById("btn-test1").innerText = globalThis.state ? "Stop" : "Play";
    }),
    React.createElement("button", {
      class: "button btn-test2", id: "btn-test2", onClick: () => {
        globalThis.state = !globalThis.state;
        doc.getElementById("btn-test2").innerText = globalThis.state ? "Stop" : "Play";
      }
    }, "Play"),
    createButton("btn-test3", "Play", () => {
      globalThis.state = !globalThis.state;
      doc.getElementById("btn-test3").innerText = globalThis.state ? "Stop" : "Play";
    }),
  ));
}

//      .btn-test {
//      }
