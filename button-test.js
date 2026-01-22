/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 100);

  const doc = globalThis["document"];

  // test button
  ns.printRaw(React.createElement("div", { class: "test" },
    React.createElement("style", { type: "text/css" }, `
      .button {
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
      .btn-test {
        background-color: ${ns.ui.getTheme()["button"]};
      }
      .btn-test:active {
        color: ${ns.ui.getTheme()["cha"]}; 
      }
      .btn-test:hover {
        background-color: ${ns.ui.getTheme()["backgroundsecondary"]}; 
      }
    `),
    React.createElement("span", { class: "ikuhg" },
      React.createElement("button", {
        class: "button btn-test", type: "button",
        onclick: `() => {
          doc.getElementById("play-btn").innerText = "[Pause]";
        }`,
      }, "Save",
      ),
    ),
  ));
}
