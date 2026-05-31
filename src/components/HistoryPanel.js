import { formatCurrency, formatPercent } from "../utils/formatCurrency.js";

export function HistoryPanel({ history, currencySymbol }) {
  return `
    <section class="card history-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Local history</p>
          <h2>Saved results</h2>
        </div>
        <button class="ghost-button js-clear-history" type="button" ${history.length ? "" : "disabled"}>
          Clear
        </button>
      </div>
      ${
        history.length
          ? `<div class="history-list">
              ${history
                .map(
                  (item) => `
                    <article class="history-item">
                      <div>
                        <strong>${item.hasArbitrage ? "Arbitrage found" : "No arbitrage"}</strong>
                        <span>${new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span>${formatPercent(item.profitPercentage)}</span>
                        <span>${formatCurrency(item.guaranteedProfit, currencySymbol)}</span>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>`
          : `<p class="empty-state">Saved calculations stay on this device only.</p>`
      }
    </section>
  `;
}
