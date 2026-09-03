(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.HouseCostCalculator = api;
})(typeof window !== 'undefined' ? window : null, function () {
  function toNumber(value) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
  }

  function hasValue(value) {
    return String(value ?? '').trim() !== '' && Number.isFinite(Number.parseFloat(value)) && toNumber(value) >= 0;
  }

  function calculateScenario(values) {
    const housePrice = toNumber(values.housePrice);
    const signedPrice = toNumber(values.signedPrice);
    const agentRate = Math.min(1, Math.max(0.3, toNumber(values.agentRate) || 0.5));
    const personalTax = toNumber(values.personalTax);
    const serviceFee = toNumber(values.serviceFee);
    const deedTax = signedPrice * 0.01;
    const agentFee = housePrice * agentRate / 100;

    return {
      housePrice,
      signedPrice,
      agentRate,
      deedTax,
      agentFee,
      personalTax,
      serviceFee,
      total: housePrice + deedTax + agentFee + personalTax + serviceFee,
      hasHousePrice: hasValue(values.housePrice),
    };
  }

  function calculateDifference(a, b) {
    if (!a.hasHousePrice || !b.hasHousePrice) return null;
    return {
      amount: Math.round(Math.abs(a.total - b.total) * 1000000) / 1000000,
      higher: a.total >= b.total ? 'A' : 'B',
    };
  }

  function formatWan(value) {
    return Number(value).toFixed(2);
  }

  return { calculateScenario, calculateDifference, formatWan };
});
