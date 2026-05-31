export function OutcomeInput({ outcome, index }) {
  return `
    <div class="outcome-row" data-outcome-id="${outcome.id}">
      <label>
        <span>Outcome label</span>
        <input
          type="text"
          class="js-outcome-label"
          value="${escapeHtml(outcome.label)}"
          placeholder="Outcome ${index + 1}"
          autocomplete="off"
        />
      </label>
      <label>
        <span>Decimal odds</span>
        <input
          type="number"
          class="js-outcome-odds"
          value="${escapeHtml(outcome.odds)}"
          min="1.01"
          step="0.01"
          inputmode="decimal"
          placeholder="2.10"
        />
      </label>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
