export function OutcomeInput({ outcome, index }) {
  return `
    <div class="outcome-row" data-outcome-id="${outcome.id}">
      <label>
        <span>Odd ${index + 1}</span>
        <input
          type="text"
          class="js-outcome-odds"
          value="${escapeHtml(outcome.odds)}"
          pattern="[0-9]*[.]?[0-9]*"
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
