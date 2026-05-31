import { createArbitrageCalculator } from "./components/ArbitrageCalculator.js";

createArbitrageCalculator(document.querySelector("#app"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works locally if service workers are unavailable.
    });
  });
}
