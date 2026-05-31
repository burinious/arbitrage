import { calculateArbitrage, formatArbitrageResult } from "../utils/arbitrage.js";
import { OutcomeInput } from "./OutcomeInput.js";
import { ResultCard } from "./ResultCard.js";
import { HistoryPanel } from "./HistoryPanel.js";

const STORAGE_KEYS = {
  preferences: "arbicalc-preferences",
  history: "arbicalc-history"
};

const defaultState = {
  totalStake: "10000",
  currencySymbol: "₦",
  outcomeCount: 2,
  theme: "light",
  outcomes: [
    { id: "outcome-1", label: "Outcome 1", odds: "2.10" },
    { id: "outcome-2", label: "Outcome 2", odds: "2.05" },
    { id: "outcome-3", label: "Outcome 3", odds: "3.30" }
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
          <div>
            <p class="eyebrow">Offline-first calculator</p>
            <h1>ArbiCalc</h1>
            <p class="lede">A local decimal-odds arbitrage calculator for education and analysis.</p>
          </div>
          <button class="theme-toggle js-theme-toggle" type="button" aria-label="Toggle dark and light mode">
            ${state.theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <div class="layout-grid">
          <section class="card input-card">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Inputs</p>
                <h2>Calculator</h2>
              </div>
              <button class="ghost-button js-reset" type="button">Reset</button>
            </div>

            <div class="control-grid">
              <label>
                <span>Total stake</span>
                <input class="js-total-stake" type="number" min="0.01" step="0.01" inputmode="decimal" value="${state.totalStake}" />
              </label>
              <label>
                <span>Currency symbol</span>
                <input class="js-currency" type="text" maxlength="4" value="${state.currencySymbol}" />
              </label>
            </div>

            <fieldset class="segmented-control">
              <legend>Number of outcomes</legend>
              <label>
                <input class="js-outcome-count" type="radio" name="outcome-count" value="2" ${state.outcomeCount === 2 ? "checked" : ""} />
                <span>2 outcomes</span>
              </label>
              <label>
                <input class="js-outcome-count" type="radio" name="outcome-count" value="3" ${state.outcomeCount === 3 ? "checked" : ""} />
                <span>3 outcomes</span>
              </label>
            </fieldset>

            <div class="outcomes-list">
              ${activeOutcomes.map((outcome, index) => OutcomeInput({ outcome, index })).join("")}
            </div>
          </section>

          <div class="results-stack">
            ${ResultCard({ result, currencySymbol: state.currencySymbol })}
            <section class="card action-card">
              <button class="primary-button js-save-result" type="button" ${result.isValid ? "" : "disabled"}>Save result</button>
              <button class="secondary-button js-copy-result" type="button" ${result.isValid ? "" : "disabled"}>Copy summary</button>
              <p class="copy-status js-copy-status" aria-live="polite"></p>
            </section>
            ${HistoryPanel({ history: state.history, currencySymbol: state.currencySymbol })}
          </div>
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

    root.querySelectorAll(".js-outcome-count").forEach((input) => {
      input.addEventListener("change", (event) => {
        state.outcomeCount = Number(event.target.value);
        persistPreferences();
        render();
      });
    });

    root.querySelectorAll(".outcome-row").forEach((row) => {
      const outcome = state.outcomes.find((item) => item.id === row.dataset.outcomeId);
      row.querySelector(".js-outcome-label").addEventListener("input", (event) => {
        const focusInfo = getFocusInfo(event.target, row.dataset.outcomeId);
        outcome.label = event.target.value;
        render(focusInfo);
      });
      row.querySelector(".js-outcome-odds").addEventListener("input", (event) => {
        const focusInfo = getFocusInfo(event.target, row.dataset.outcomeId);
        outcome.odds = event.target.value;
        render(focusInfo);
      });
    });

    root.querySelector(".js-reset").addEventListener("click", () => {
      state = { ...state, ...structuredClone(defaultState), history: state.history, theme: state.theme };
      persistPreferences();
      render();
    });

    root.querySelector(".js-theme-toggle").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      persistPreferences();
      render();
    });

    root.querySelector(".js-save-result").addEventListener("click", () => {
      if (!result.isValid) return;
      state.history = [
        {
          createdAt: new Date().toISOString(),
          hasArbitrage: result.hasArbitrage,
          totalImpliedProbability: result.totalImpliedProbability,
          guaranteedProfit: result.guaranteedProfit,
          profitPercentage: result.profitPercentage
        },
        ...state.history
      ].slice(0, 12);
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
      render();
    });

    root.querySelector(".js-copy-result").addEventListener("click", async () => {
      if (!result.isValid) return;
      const text = formatArbitrageResult(result, state.currencySymbol);
      const status = root.querySelector(".js-copy-status");
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = "Summary copied.";
      } catch {
        status.textContent = "Copy is unavailable in this browser.";
      }
    });

    root.querySelector(".js-clear-history").addEventListener("click", () => {
      state.history = [];
      localStorage.removeItem(STORAGE_KEYS.history);
      render();
    });
  }

  function persistPreferences() {
    localStorage.setItem(
      STORAGE_KEYS.preferences,
      JSON.stringify({
        totalStake: state.totalStake,
        currencySymbol: state.currencySymbol,
        outcomeCount: state.outcomeCount,
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
    ...preferences,
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
