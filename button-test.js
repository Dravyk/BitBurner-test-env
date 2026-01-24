/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 115);

  const doc = globalThis["document"];

  globalThis.state = false;

  const bbStyle = React.createElement("style", { type: "text/css" }, `
:root {
  --clickX: 0;
  --clickY: 0;
}
.btn {
  background-color: ${ns.ui.getTheme()["button"]};
  border: 1px solid ${ns.ui.getTheme()["well"]};
  color: ${ns.ui.getTheme()["primary"]};
  padding: 8.5px 14px;
  font-family: ${ns.ui.getStyles()["fontFamily"]};
  font-size: ${ns.ui.getStyles()["tailFontSize" - 1.5]}px;
  margin: 4px 2px;
  transition-duration: 0.25s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.btn span {
  position: absolute;
  border-radius: 50%;
  background-color: ${ns.ui.getTheme()["primary"]};

  width: 100px;
  height: 100px;
  margin-top: -50px;
  margin-left: -50px;

  animation: ripple 1s;
  opacity: 0;
}
.btn:active {
  border: 1px solid ${ns.ui.getTheme()["cha"]};
}
.btn:hover {
  background-color: ${ns.ui.getTheme()["backgroundsecondary"]}; 
}
@keyframes ripple {
  from {
    opacity: 1;
    transform: scale(0);
  }
  to {
    opacity: 0;
    transform: scale(10);
  }
}`
  );

  ns.printRaw(React.createElement("div", {}, bbStyle,
    React.createElement("span", {},
      React.createElement("button", {
        class: "btn", id: "btn-test", onClick: (e) => {
          console.clear();
          console.log(e);
          // Create span element
          let ripple = doc.createElement("span");
          // Add ripple class to span
          ripple.classList.add("ripple");
          // Add span to the button
          e.currentTarget.appendChild(ripple);
          // Get position of X
          const x = e.clientX - e.currentTarget.offsetLeft;
          // Get position of Y
          const y = e.clientY - e.currentTarget.offsetTop;
          // Position the span element
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          // Remove span after 0.3s
          setTimeout(() => {
            ripple.remove();
          }, 300);
          // Test code
          e.currentTarget.innerText = `${x}, ${y}`;
        }
      },
        "Test")),
  ));
}
