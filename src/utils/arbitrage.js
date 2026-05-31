export function calculateImpliedProbability(odds) {
  const value = Number(odds);
  return Number.isFinite(value) && value > 1 ? 1 / value : null;
}

export function calculateArbitrage({ totalStake, outcomes }) {
  const stake = Number(totalStake);
  const normalizedOutcomes = Array.isArray(outcomes) ? outcomes : [];
  const errors = [];

  if (!Number.isFinite(stake) || stake <= 0) {
    errors.push("Enter a total stake greater than 0.");
  }

  if (![2, 3].includes(normalizedOutcomes.length)) {
    errors.push("Choose either 2 or 3 outcomes.");
  }

  const outcomeResults = normalizedOutcomes.map((outcome, index) => {
    const odds = Number(outcome.odds);
    const impliedProbability = calculateImpliedProbability(odds);

    if (impliedProbability === null) {
      errors.push(`${outcome.label || `Outcome ${index + 1}`} odds must be greater than 1.`);
    }

    return {
      id: outcome.id || `outcome-${index + 1}`,
      label: outcome.label?.trim() || `Outcome ${index + 1}`,
      odds,
      impliedProbability
    };
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      outcomes: outcomeResults,
      totalStake: Number.isFinite(stake) ? stake : 0
    };
  }

  // Arbitrage math: split the stake in proportion to each outcome's implied probability.
  const totalImpliedProbability = outcomeResults.reduce(
    (sum, outcome) => sum + outcome.impliedProbability,
    0
  );
  const hasArbitrage = totalImpliedProbability < 1;
  const guaranteedReturn = stake / totalImpliedProbability;
  const guaranteedProfit = guaranteedReturn - stake;
  const profitPercentage = (guaranteedProfit / stake) * 100;

  return {
    isValid: true,
    errors: [],
    hasArbitrage,
    totalStake: stake,
    totalImpliedProbability,
    guaranteedReturn,
    guaranteedProfit,
    profitPercentage,
    outcomes: outcomeResults.map((outcome) => {
      const stakeForOutcome = (stake * outcome.impliedProbability) / totalImpliedProbability;
      return {
        ...outcome,
        stake: stakeForOutcome,
        returnAmount: stakeForOutcome * outcome.odds
      };
    })
  };
}

export function formatArbitrageResult(result, currencySymbol = "₦") {
  if (!result?.isValid) {
    return "ArbiCalc result is incomplete. Check the stake and odds inputs.";
  }

  const money = (amount) => `${currencySymbol}${amount.toFixed(2)}`;
  const lines = [
    `Arbitrage status: ${result.hasArbitrage ? "Found" : "Not found"}`,
    `Total implied probability: ${(result.totalImpliedProbability * 100).toFixed(2)}%`,
    `Guaranteed return: ${money(result.guaranteedReturn)}`,
    `Guaranteed profit: ${money(result.guaranteedProfit)}`,
    `Profit percentage: ${result.profitPercentage.toFixed(2)}%`,
    "Stake allocation:"
  ];

  result.outcomes.forEach((outcome) => {
    lines.push(
      `- ${outcome.label}: stake ${money(outcome.stake)}, return ${money(outcome.returnAmount)} at odds ${outcome.odds}`
    );
  });

  return lines.join("\n");
}
