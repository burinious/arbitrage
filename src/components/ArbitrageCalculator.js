import { calculateArbitrage } from "../utils/arbitrage.js";
import { OutcomeInput } from "./OutcomeInput.js";
import { ResultCard } from "./ResultCard.js";

const STORAGE_KEYS = {
  preferences: "arbicalc-preferences",
  history: "arbicalc-history"
};

const defaultState = {
  totalStake: "",
  currencySymbol: "₦",
  outcomeCount: 2,
  theme: "dark",
  outcomes: [
    { id: "outcome-1", label: "Odd 1", odds: "" },
    { id: "outcome-2", label: "Odd 2", odds: "" },
    { id: "outcome-3", label: "Odd 3", odds: "" }
  ],
  history: []
};

export function createArbitrageCalculator(root) {
  let state = loadState();

  function render(focusInfo = null) {
    const activeOutcomes = state.outcomes.slice(0, state.outcomeCount);
    const result = calculateArbitrage({
      totalStake: state.totalStake,
      outcomes: activeOutcomes
    });

    document.documentElement.dataset.theme = state.theme;
    root.innerHTML = `
      <main class="app-shell">
        <header class="app-header">
          <button class="icon-button" type="button" aria-label="Menu">☰</button>
          <h1>ArbiCalc</h1>
          <div class="header-actions">
            <span class="odds-type">Decimal ▾</span>
            <button class="theme-toggle js-theme-toggle" type="button" aria-label="Toggle dark and light mode">
              <span class="theme-icon ${state.theme === "dark" ? "theme-icon--sun" : "theme-icon--moon"}"></span>
            </button>
          </div>
        </header>

        <div class="calculator-screen">
          <section class="input-card">

            <div class="outcomes-list">
              ${activeOutcomes.map((outcome, index) => OutcomeInput({ outcome, index })).join("")}
            </div>

            <div class="control-grid">
              <label class="stake-field">
                <span>Total Amount</span>
                <input class="js-total-stake" type="number" min="0.01" step="0.01" inputmode="decimal" value="${state.totalStake}" placeholder="Enter total amount" />
              </label>
              <label class="currency-field">
                <span>Currency</span>
                <input class="js-currency" type="text" maxlength="4" value="${state.currencySymbol}" />
              </label>
            </div>

            <div class="outcome-actions">
              ${
                state.outcomeCount === 2
                  ? `<button class="text-button js-add-odd" type="button">＋ More Odds</button>`
                  : `<button class="text-button js-remove-odd" type="button">− Remove Odd 3</button>`
              }
              <button class="text-button js-reset" type="button">↻ Reset</button>
            </div>

            <button class="calculate-button" type="button">Calculate</button>
          </section>

          ${ResultCard({ result, currencySymbol: state.currencySymbol })}
        </div>
      </main>
    `;

    bindEvents(result);
    restoreFocus(focusInfo);
  }

  function bindEvents(result) {
    root.querySelector(".js-total-stake").addEventListener("input", (event) => {
      const focusInfo = getFocusInfo(event.target);
      state.totalStake = event.target.value;
      persistPreferences();
      render(focusInfo);
    });

    root.querySelector(".js-currency").addEventListener("input", (event) => {
      const focusInfo = getFocusInfo(event.target);
      state.currencySymbol = event.target.value.trim() || "₦";
      persistPreferences();
      render(focusInfo);
    });

    root.querySelectorAll(".outcome-row").forEach((row) => {
      const outcome = state.outcomes.find((item) => item.id === row.dataset.outcomeId);
      row.querySelector(".js-outcome-odds").addEventListener("input", (event) => {
        const focusInfo = getFocusInfo(event.target, row.dataset.outcomeId);
        outcome.odds = event.target.value;
        render(focusInfo);
      });
    });

    root.querySelector(".js-add-odd")?.addEventListener("click", () => {
      state.outcomeCount = 3;
      persistPreferences();
      render();
    });

    root.querySelector(".js-remove-odd")?.addEventListener("click", () => {
      state.outcomeCount = 2;
      state.outcomes[2].odds = "";
      persistPreferences();
      render();
    });

    root.querySelector(".js-reset").addEventListener("click", () => {
      state = { ...state, ...structuredClone(defaultState), history: state.history, theme: state.theme };
      persistPreferences();
      render();
    });

    root.querySelector(".js-theme-toggle")?.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      persistPreferences();
      render();
    });

  }

  function persistPreferences() {
    localStorage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify({
        currencySymbol: state.currencySymbol,
        theme: state.theme
      })
    );
  }

  render();
}

function loadState() {
  const preferences = readStorage(STORAGE_KEYS.preferences, {});
  const history = readStorage(STORAGE_KEYS.history, []);
  return {
    ...structuredClone(defaultState),
    currencySymbol: preferences.currencySymbol || defaultState.currencySymbol,
    theme: preferences.theme || defaultState.theme,
    history: Array.isArray(history) ? history : []
  };
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function getFocusInfo(element, outcomeId = null) {
  const className = [...element.classList].find((item) => item.startsWith("js-"));
  if (!className) return null;

  return {
    selector: outcomeId ? `[data-outcome-id="${outcomeId}"] .${className}` : `.${className}`,
    start: getSelectionValue(element, "selectionStart"),
    end: getSelectionValue(element, "selectionEnd")
  };
}

function restoreFocus(focusInfo) {
  if (!focusInfo) return;

  const element = document.querySelector(focusInfo.selector);
  if (!element) return;

  element.focus({ preventScroll: true });
  if (focusInfo.start !== null && focusInfo.end !== null) {
    try {
      element.setSelectionRange(focusInfo.start, focusInfo.end);
    } catch {
      // Number inputs do not support text selection in every browser.
    }
  }
}

function getSelectionValue(element, key) {
  try {
    return typeof element[key] === "number" ? element[key] : null;
  } catch {
    return null;
  }
}
