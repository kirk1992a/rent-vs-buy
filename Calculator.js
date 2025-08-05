// Calculator.js
import React, { useState, useEffect } from 'react';

export default function Calculator() {
  const [inputs, setInputs] = useState({
    homePrice: 400000,
    downPaymentPercent: 20,
    interestRate: 5,
    loanTerm: 30,
    propertyTaxPercent: 1.8,
    insurancePercent: 0.6,
    annualHOA: 0,
    maintenancePercent: 0.4,
    costToSellPercent: 8,

    rent: 2000,
    rentersInsurance: 300,
    rentGrowth: 2,

    investmentReturn: 7,
    appreciation: 3,

    filingStatus: 'single' // or 'married'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const monthlyRate = (rate) => rate / 100 / 12;
  const annualToMonthly = (value) => value / 12;

  const stdDeduction = inputs.filingStatus === 'married' ? 29200 : 14600;

  const downPayment = inputs.homePrice * inputs.downPaymentPercent / 100;
  const loanAmount = inputs.homePrice - downPayment;
  const totalMonths = inputs.loanTerm * 12;

  const monthlyInterest = monthlyRate(inputs.interestRate);
  const mortgagePayment = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, totalMonths)) / (Math.pow(1 + monthlyInterest, totalMonths) - 1);

  const propertyTaxAnnual = inputs.homePrice * inputs.propertyTaxPercent / 100;
  const insuranceAnnual = inputs.homePrice * inputs.insurancePercent / 100;
  const maintenanceAnnual = inputs.homePrice * inputs.maintenancePercent / 100;

  const monthlyPropertyTax = annualToMonthly(propertyTaxAnnual);
  const monthlyInsurance = annualToMonthly(insuranceAnnual);
  const monthlyMaintenance = annualToMonthly(maintenanceAnnual);
  const monthlyHOA = annualToMonthly(inputs.annualHOA);

  const monthlyRentersInsurance = annualToMonthly(inputs.rentersInsurance);

  // Simulation arrays
  const [breakEvenMonth, setBreakEvenMonth] = useState(null);
  const [ownData, setOwnData] = useState([]);
  const [rentData, setRentData] = useState([]);
  useEffect(() => {
    let own = [];
    let rent = [];

    let loanBalance = loanAmount;
    let homeValue = inputs.homePrice;
    let renterInvestment = downPayment;
    let equity = 0;

    let month = 0;
    let cumulativePrincipal = 0;

    setBreakEvenMonth(null);

    while (month < totalMonths) {
      // Home ownership calculations
      let monthlyInterestPayment = loanBalance * monthlyInterest;
      let principalPayment = mortgagePayment - monthlyInterestPayment;
      cumulativePrincipal += principalPayment;
      loanBalance -= principalPayment;

      homeValue *= (1 + inputs.appreciation / 100 / 12);

      const totalHomeCost = mortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyHOA + monthlyMaintenance;

      // Calculate equity at this point (home value - remaining balance - cost to sell)
      const costToSell = homeValue * (inputs.costToSellPercent / 100);
      equity = homeValue - loanBalance - costToSell;

      // Rent path
      const currentRent = inputs.rent * Math.pow(1 + inputs.rentGrowth / 100 / 12, month);
      const rentTotalCost = currentRent + monthlyRentersInsurance;

      // Delta between owning and renting
      const monthlyDelta = totalHomeCost - rentTotalCost;

      // Invest the difference if renting is cheaper
      if (monthlyDelta > 0) {
        renterInvestment *= (1 + inputs.investmentReturn / 100 / 12);
        renterInvestment += monthlyDelta;
      } else {
        renterInvestment *= (1 + inputs.investmentReturn / 100 / 12);
        renterInvestment += monthlyDelta; // still deduct from investment
      }

      // Store for chart/table
      own.push({ month, equity, homeValue, loanBalance, totalHomeCost });
      rent.push({ month, renterInvestment, rentTotalCost });

      // Break-even check
      if (!breakEvenMonth && renterInvestment >= equity) {
        setBreakEvenMonth(month + 1); // month number (1-indexed)
      }

      month++;
    }

    setOwnData(own);
    setRentData(rent);
  }, [inputs]);
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Inputs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 200px', gap: '0.5rem' }}>
        <label>Home Price</label><input name="homePrice" value={inputs.homePrice} onChange={handleChange} />
        <label>Down Payment %</label><input name="downPaymentPercent" value={inputs.downPaymentPercent} onChange={handleChange} />
        <label>Interest Rate %</label><input name="interestRate" value={inputs.interestRate} onChange={handleChange} />
        <label>Loan Term (years)</label><input name="loanTerm" value={inputs.loanTerm} onChange={handleChange} />
        <label>Property Tax %</label><input name="propertyTaxPercent" value={inputs.propertyTaxPercent} onChange={handleChange} />
        <label>Insurance %</label><input name="insurancePercent" value={inputs.insurancePercent} onChange={handleChange} />
        <label>Annual HOA</label><input name="annualHOA" value={inputs.annualHOA} onChange={handleChange} />
        <label>Maintenance %</label><input name="maintenancePercent" value={inputs.maintenancePercent} onChange={handleChange} />
        <label>Cost to Sell %</label><input name="costToSellPercent" value={inputs.costToSellPercent} onChange={handleChange} />
        <label>Monthly Rent</label><input name="rent" value={inputs.rent} onChange={handleChange} />
        <label>Renters Insurance (annual)</label><input name="rentersInsurance" value={inputs.rentersInsurance} onChange={handleChange} />
        <label>Rent Growth %</label><input name="rentGrowth" value={inputs.rentGrowth} onChange={handleChange} />
        <label>Investment Return %</label><input name="investmentReturn" value={inputs.investmentReturn} onChange={handleChange} />
        <label>Property Appreciation %</label><input name="appreciation" value={inputs.appreciation} onChange={handleChange} />
      </div>

      <h2>Results</h2>
      {breakEvenMonth ? (
        <p>Break-even occurs at <strong>month {breakEvenMonth}</strong></p>
      ) : (
        <p>No break-even within {totalMonths} months</p>
      )}

      <table border="1" cellPadding="5" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Own: Equity</th>
            <th>Own: Home Value</th>
            <th>Own: Loan Balance</th>
            <th>Rent: Investment</th>
            <th>Rent Cost</th>
          </tr>
        </thead>
        <tbody>
          {ownData.map((row, i) => (
            <tr key={i} style={{ background: breakEvenMonth === row.month + 1 ? '#d1ffd1' : 'white' }}>
              <td>{row.month + 1}</td>
              <td>${row.equity.toFixed(0)}</td>
              <td>${row.homeValue.toFixed(0)}</td>
              <td>${row.loanBalance.toFixed(0)}</td>
              <td>${rentData[i].renterInvestment.toFixed(0)}</td>
              <td>${rentData[i].rentTotalCost.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

