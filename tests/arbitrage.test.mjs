import assert from "node:assert/strict";
import { calculateArbitrage, calculateImpliedProbability } from "../src/utils/arbitrage.js";

assert.equal(calculateImpliedProbability(2), 0.5);
assert.equal(calculateImpliedProbability(1), null);

const twoOutcome = calculateArbitrage({
  totalStake: 10000,
  outcomes: [
    { label: "A", odds: 2.1 },
    { label: "B", odds: 2.05 }
  ]
});

assert.equal(twoOutcome.isValid, true);
assert.equal(twoOutcome.hasArbitrage, true);
assert.equal(twoOutcome.outcomes.length, 2);
assert.ok(Math.abs(twoOutcome.totalImpliedProbability - 0.9639953542392566) < 0.0000001);
assert.ok(Math.abs(twoOutcome.guaranteedReturn - 10373.493975903614) < 0.0000001);

const threeOutcome = calculateArbitrage({
  totalStake: 12000,
  outcomes: [
    { label: "Home", odds: 2.8 },
    { label: "Draw", odds: 3.7 },
    { label: "Away", odds: 3.1 }
  ]
});

assert.equal(threeOutcome.isValid, true);
assert.equal(threeOutcome.hasArbitrage, true);
assert.equal(threeOutcome.outcomes.length, 3);
assert.ok(threeOutcome.guaranteedProfit > 0);

const noArbitrage = calculateArbitrage({
  totalStake: 5000,
  outcomes: [
    { label: "A", odds: 1.8 },
    { label: "B", odds: 1.9 }
  ]
});

assert.equal(noArbitrage.isValid, true);
assert.equal(noArbitrage.hasArbitrage, false);
assert.ok(noArbitrage.guaranteedProfit < 0);

const invalid = calculateArbitrage({
  totalStake: 0,
  outcomes: [
    { label: "A", odds: 1 },
    { label: "B", odds: 2 }
  ]
});

assert.equal(invalid.isValid, false);
assert.ok(invalid.errors.length >= 2);

console.log("Arbitrage calculations passed.");
