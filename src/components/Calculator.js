import React, { useState } from 'react';

export default function Calculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.8);
  const [insurance, setInsurance] = useState(0.6);
  const [hoa, setHoa] = useState(0);
  const [maintenance, setMaintenance] = useState(0.4);
  const [rent, setRent] = useState(2500);
  const [rentGrowth, setRentGrowth] = useState(2);
  const [investmentReturn, setInvestmentReturn] = useState(7);

  const calcMonthlyPayment = (P, r, n) =>
    P * (r / 12) / (1 - Math.pow(1 + r / 12, -n));

  const calculate = () => {
    const loanAmount = homePrice - downPayment;
    const monthlyPmt = calcMonthlyPayment(loanAmount, interestRate / 100, loanTerm * 12);
    const totalLoan = monthlyPmt * 12 * loanTerm;
    const taxes = homePrice * (propertyTax / 100) * loanTerm;
    const ins = homePrice * (insurance / 100) * loanTerm;
    const main = homePrice * (maintenance / 100) * loanTerm;
    const hoaFees = hoa * 12 * loanTerm;

    const owningCost = totalLoan + taxes + ins + main + hoaFees - (downPayment * Math.pow(1 + investmentReturn / 100, loanTerm));

    let totalRent = 0;
    let currentRent = rent;
    for (let i = 0; i < loanTerm; i++) {
      totalRent += currentRent * 12;
      currentRent *= 1 + rentGrowth / 100;
    }
    const invested = downPayment * Math.pow(1 + investmentReturn / 100, loanTerm);
    const rentingCost = totalRent - invested;

    return {
      monthlyPmt: monthlyPmt.toFixed(2),
      owningCost: owningCost.toFixed(0),
      rentingCost: rentingCost.toFixed(0)
    };
  };

  const result = calculate();

  return (
    <div>
      <h2>Inputs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <label>Home Price <input type="number" value={homePrice} onChange={e => setHomePrice(+e.target.value)} /></label>
        <label>Down Payment <input type="number" value={downPayment} onChange={e => setDownPayment(+e.target.value)} /></label>
        <label>Interest Rate (%) <input type="number" value={interestRate} step="0.1" onChange={e => setInterestRate(+e.target.value)} /></label>
        <label>Loan Term (years) <input type="number" value={loanTerm} onChange={e => setLoanTerm(+e.target.value)} /></label>
        <label>Property Tax (%) <input type="number" value={propertyTax} step="0.1" onChange={e => setPropertyTax(+e.target.value)} /></label>
        <label>Insurance (%) <input type="number" value={insurance} step="0.1" onChange={e => setInsurance(+e.target.value)} /></label>
        <label>HOA Fees (monthly) <input type="number" value={hoa} onChange={e => setHoa(+e.target.value)} /></label>
        <label>Maintenance (%/yr) <input type="number" value={maintenance} step="0.1" onChange={e => setMaintenance(+e.target.value)} /></label>
        <label>Monthly Rent <input type="number" value={rent} onChange={e => setRent(+e.target.value)} /></label>
        <label>Rent Growth (%/yr) <input type="number" value={rentGrowth} step="0.1" onChange={e => setRentGrowth(+e.target.value)} /></label>
        <label>Investment Return (%) <input type="number" value={investmentReturn} step="0.1" onChange={e => setInvestmentReturn(+e.target.value)} /></label>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Results</h2>
      <p><strong>Monthly Mortgage Payment:</strong> ${result.monthlyPmt}</p>
      <p><strong>Net Cost of Owning (after investment returns):</strong> ${result.owningCost}</p>
      <p><strong>Net Cost of Renting (after investment returns):</strong> ${result.rentingCost}</p>
    </div>
  );
}