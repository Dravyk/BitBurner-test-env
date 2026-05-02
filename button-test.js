/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(500, 115);

  const doc = globalThis["document"];

  const ripple_center = React.createElement("style", { type: "text/css" }, `
.ripple-center {
  background-position: relative;
  transition: background 0.8s;
}
.ripple-center:hover {
  background-color: ${ns.ui.getTheme()["backgroundsecondary"]};
  background-image: radial-gradient(circle, transparent 1%, ${ns.ui.getTheme()["backgroundsecondary"]} 1%);
  background-position: center;
  background-size: 15000%;
}
.ripple-center:active {
  background-color: ${ns.ui.getTheme()["primarydark"]};
  background-size: 100%;
  transition: background 0s;
}`
  );

  ns.printRaw(
    React.createElement("div", {}, ripple_center,
      React.createElement("button", {
        className: "ripple-center MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary css-i4mct0-MuiButtonBase-root-MuiButton-root", id: "btn-test",
        onClick: (e) => {
          console.clear();
          console.log(e);
          // Get position of X
          const x = e.clientX - e.currentTarget.offsetLeft;
          // Get position of Y
          const y = e.clientY - e.currentTarget.offsetTop;
          // Test code
          //e.currentTarget.innerText = `${x}, ${y}`;
        },
        onMouseEnter: (e) => {
          const { left, top } = e.currentTarget.getBoundingClientRect();
          // Get position of X
          //const x = e.clientX - e.currentTarget.offsetLeft;
          const x = e.clientX - Math.trunc(left);
          // Get position of Y
          //const y = e.clientY - e.currentTarget.offsetTop;
          const y = e.clientY - Math.trunc(top);
          // Test code
          //e.currentTarget.innerText = `${x}, ${y}`;
        },
      }, "Center")
    ),
  );

  ns.print('');

  const ripple_gg = React.createElement("style", { type: "text/css" }, `
.ripple-gg {
  padding: 12px 50px;
  border: none;
  border-radius: 5px;
  background-color: #1abc9c;
  color: #fff;
  font-size: 18px;
  outline: none;
  cursor: pointer;
  /* We need this to position span inside button */
  position: relative;
  ovflow: hidden;
  box-shadow: 6px 7px 40px -4px rgba(0, 0, 0, 0.2);
}
.ripple-gg span {
  position: absolute;
  border-radius: 50%;
  /* To make it round */
  background-color: rgba(0, 0, 0, 0.3);

  width: 100px;
  height: 100px;
  margin-top: -50px;
  /* for positioning */
  margin-left: -50px;

  animation: ripple 1s;
  opacity: 0;
}
/* Add animation */
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

  ns.printRaw(
    React.createElement("button", {
      className: "ripple-gg",
      onClick: (e) => {
        // Create span element
        let ripple = doc.createElement("span");
        // Add ripple class to span
        ripple.classList.add("ripple-gg");
        // Add span to the button
        this.appendChild(ripple);
        // Get position of X
        let x = e.clientX - e.currentTarget.offsetLeft;
        // Get position of Y
        let y = e.clientY - e.currentTarget.offsetTop;
        // Position the span element
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        // Remove span after 0.3s
        setTimeout(() => {
          ripple.remove();
        }, 300);
      },
    }, ripple_gg, "Ripple<&trade;>")
  );
}
