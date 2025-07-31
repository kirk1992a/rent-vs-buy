import React, { useState } from 'react';

export default function Calculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const downPayment = (homePrice * downPaymentPct) / 100;
  const [interestRate, setInterestRate] = useState(6);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.8);
  const [insurance, setInsurance] = useState(0.6);
  const [hoa, setHoa] = useState(0);
  const [maintenance, setMaintenance] = useState(0.4);
  const [costToSell, setCostToSell] = useState(8);
  const [rent, setRent] = useState(2500);
  const [rentGrowth, setRentGrowth] = useState(2);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [appreciation, setAppreciation] = useState(3);

  const calcMonthlyPayment = (P, r, n) =>
    P * (r / 12) / (1 - Math.pow(1 + r / 12, -n));

  const calculate = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyPmt = calcMonthlyPayment(loanAmount, interestRate / 100, loanTerm * 12);
    const totalInterest = monthlyPmt * 12 * loanTerm - loanAmount;
    const taxes = homePrice * (propertyTax / 100) * loanTerm;
    const ins = homePrice * (insurance / 100) * loanTerm;
    const main = homePrice * (maintenance / 100) * loanTerm;
    const hoaFees = hoa * loanTerm;
    const futureHomeValue = homePrice * Math.pow(1 + appreciation / 100, loanTerm);
    const sellingCosts = futureHomeValue * (costToSell / 100);
    const equity = futureHomeValue - sellingCosts - (loanAmount - (monthlyPmt * 12 * loanTerm - totalInterest));

    let totalRent = 0;
    let currentRent = rent;
    let rentAccount = downPayment;
    for (let i = 0; i < loanTerm; i++) {
      for (let m = 0; m < 12; m++) {
        const monthlyCost = monthlyPmt + (hoa / 12) + (homePrice * ((propertyTax + insurance + maintenance) / 100) / 12);
        const delta = monthlyCost - currentRent;
        rentAccount += (delta < 0 ? Math.abs(delta) : -delta);
        rentAccount *= Math.pow(1 + investmentReturn / 100 / 12, 1);
      }
      totalRent += currentRent * 12;
      currentRent *= 1 + rentGrowth / 100;
    }

    const ownCost = monthlyPmt * 12 * loanTerm + taxes + ins + main + hoaFees;
    return {
      monthlyPmt: monthlyPmt.toFixed(2),
      downPayment,
      totalOwn: ownCost.toFixed(0),
      rentBalance: rentAccount.toFixed(0),
      equity: equity.toFixed(0)
    };
  };

  const result = calculate();

  return (
    <div>
      <h2>Inputs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <label>Home Price <input type="number" value={homePrice} onChange={e => setHomePrice(+e.target.value)} /></label>
        <label>Down Payment (%) <input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(+e.target.value)} /></label>
        <label>Down Payment ($): <strong>${downPayment.toLocaleString()}</strong></label>
        <label>Interest Rate (%) <input type="number" value={interestRate} step="0.1" onChange={e => setInterestRate(+e.target.value)} /></label>
        <label>Loan Term (years) <input type="number" value={loanTerm} onChange={e => setLoanTerm(+e.target.value)} /></label>
        <label>Property Tax (%) <input type="number" value={propertyTax} step="0.1" onChange={e => setPropertyTax(+e.target.value)} /></label>
        <label>Insurance (%) <input type="number" value={insurance} step="0.1" onChange={e => setInsurance(+e.target.value)} /></label>
        <label>HOA Fees (annual) <input type="number" value={hoa} onChange={e => setHoa(+e.target.value)} /></label>
        <label>Maintenance (%/yr) <input type="number" value={maintenance} step="0.1" onChange={e => setMaintenance(+e.target.value)} /></label>
        <label>Cost to Sell (%) <input type="number" value={costToSell} step="0.1" onChange={e => setCostToSell(+e.target.value)} /></label>
        <label>Monthly Rent <input type="number" value={rent} onChange={e => setRent(+e.target.value)} /></label>
        <label>Rent Growth (%/yr) <input type="number" value={rentGrowth} step="0.1" onChange={e => setRentGrowth(+e.target.value)} /></label>
        <label>Investment Return (%) <input type="number" value={investmentReturn} step="0.1" onChange={e => setInvestmentReturn(+e.target.value)} /></label>
        <label>Property Appreciation (%) <input type="number" value={appreciation} step="0.1" onChange={e => setAppreciation(+e.target.value)} /></label>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>Own</h3>
          <p><strong>Mortgage P&I:</strong> ${result.monthlyPmt} x 12 x {loanTerm}</p>
          <p><strong>Total Ownership Cost:</strong> ${result.totalOwn}</p>
          <p><strong>Net Equity After Sale:</strong> ${result.equity}</p>
        </div>
        <div>
          <h3>Rent</h3>
          <p><strong>Projected Investment Balance:</strong> ${result.rentBalance}</p>
        </div>
        <div>
          <h3>Break Even</h3>
          <p>{parseFloat(result.rentBalance) > parseFloat(result.equity) ? 'Rent Wins' : 'Buy Wins'}</p>
        </div>
      </div>
    </div>
  );
}