import { formatCurrency, formatPercent } from "../utils/formatCurrency.js";

export function ResultCard({ result, currencySymbol }) {
  if (!result?.isValid) {
    return `
      <section class="card result-card result-card--waiting" aria-live="polite">
        <div class="status-pill status-pill--neutral">Waiting for valid inputs</div>
        <h2>Calculation result</h2>
        <ul class="validation-list">
          ${(result?.errors || ["Enter a total stake and odds greater than 1."])
            .map((error) => `<li>${error}</li>`)
            .join("")}
        </ul>
      </section>
    `;
  }

  const statusClass = result.hasArbitrage ? "success" : "warning";
  const statusText = result.hasArbitrage ? "Arbitrage found" : "No arbitrage";

  return `
    <section class="card result-card result-card--${statusClass}" aria-live="polite">
      <div class="status-pill status-pill--${statusClass}">${statusText}</div>
      <div class="result-grid">
        ${metric("Total implied probability", formatPercent(result.totalImpliedProbability * 100))}
        ${metric("Guaranteed return", formatCurrency(result.guaranteedReturn, currencySymbol))}
        ${metric("Guaranteed profit", formatCurrency(result.guaranteedProfit, currencySymbol))}
        ${metric("Profit percentage", formatPercent(result.profitPercentage))}
      </div>
      <div class="allocation-table" role="table" aria-label="Stake allocation">
        <div class="allocation-head" role="row">
          <span role="columnheader">Outcome</span>
          <span role="columnheader">Stake</span>
          <span role="columnheader">Return</span>
        </div>
        ${result.outcomes
          .map(
            (outcome) => `
              <div class="allocation-row" role="row">
                <span role="cell">${outcome.label}</span>
                <span role="cell">${formatCurrency(outcome.stake, currencySymbol)}</span>
                <span role="cell">${formatCurrency(outcome.returnAmount, currencySymbol)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function metric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}
