import { formatCurrency, formatPercent } from "../utils/formatCurrency.js";

export function ResultCard({ result, currencySymbol }) {
  if (!result?.isValid) {
    return `
      <section class="result-card result-card--waiting" aria-live="polite">
        <div class="result-strip">
          <span>ROI: --</span>
          <strong>Enter values</strong>
        </div>
        <ul class="validation-list">
          ${(result?.errors || ["Enter a total stake and odds greater than 1."])
            .map((error) => `<li>${error}</li>`)
            .join("")}
        </ul>
      </section>
    `;
  }

  const statusClass = result.hasArbitrage ? "success" : "warning";
  const statusText = result.hasArbitrage ? "Sure Arb" : "No Arb";

  return `
    <section class="result-card result-card--${statusClass}" aria-live="polite">
      <div class="result-strip result-strip--${statusClass}">
        <span>ROI: ${formatPercent(result.profitPercentage)}</span>
        <strong>${statusText}</strong>
      </div>
      <div class="summary-box">
        ${summaryRow("Total Profit", formatCurrency(result.guaranteedProfit, currencySymbol))}
        ${summaryRow("Total Payout", formatCurrency(result.guaranteedReturn, currencySymbol))}
        ${summaryRow("Implied Probability", formatPercent(result.totalImpliedProbability * 100))}
      </div>
      <div class="allocation-grid" aria-label="Stake allocation">
        ${result.outcomes
          .map((outcome, index) => allocationItem(index + 1, outcome, currencySymbol))
          .join("")}
      </div>
    </section>
  `;
}

function summaryRow(label, value) {
  return `
    <div class="summary-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function allocationItem(number, outcome, currencySymbol) {
  return `
    <div class="allocation-item">
      <span>Amount ${number}</span>
      <strong>${formatCurrency(outcome.stake, currencySymbol)}</strong>
    </div>
    <div class="allocation-item">
      <span>Payout Amount ${number}</span>
      <strong>${formatCurrency(outcome.returnAmount, currencySymbol)}</strong>
    </div>
  `;
}
