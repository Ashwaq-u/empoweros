import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Helper for parsing dollar value exactly as HealthRiskMeter does
function calculateTotalUnclaimedFormatted(unclaimedValueOrBenefits) {
  if (!unclaimedValueOrBenefits || unclaimedValueOrBenefits.length === 0) {
    return '$0';
  }

  let total = 0;
  let foundDollar = false;

  for (const item of unclaimedValueOrBenefits) {
    const textToScan = `${item.estimatedValue || ''} ${item.title || ''}`;

    const rangeMatch = textToScan.match(/\$([0-9,]+(?:\.[0-9]+)?)\s*(?:–|-|to)\s*\$([0-9,]+(?:\.[0-9]+)?)/i);
    if (rangeMatch) {
      foundDollar = true;
      const n1 = parseFloat(rangeMatch[1].replace(/,/g, ''));
      const n2 = parseFloat(rangeMatch[2].replace(/,/g, ''));
      if (!isNaN(n1) && !isNaN(n2)) {
        total += (n1 + n2) / 2;
        continue;
      }
    }

    const matches = textToScan.match(/\$([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)/g);
    if (matches && matches.length > 0) {
      foundDollar = true;
      const nums = matches
        .map((m) => parseFloat(m.replace(/[$,]/g, '')))
        .filter((n) => !isNaN(n) && n > 0);

      if (nums.length === 1) {
        total += nums[0];
      } else if (nums.length >= 2) {
        if (textToScan.includes('/mo') || textToScan.includes('/month') || textToScan.includes('per month')) {
          total += Math.max(...nums);
        } else {
          total += (nums[0] + nums[1]) / 2;
        }
      }
    }
  }

  if (foundDollar && total > 0) {
    return `$${Math.round(total).toLocaleString()}`;
  }

  return '$0';
}

async function runVerification() {
  console.log('================================================================');
  console.log('EMPOWEROS COMPLETE END-TO-END FINAL VERIFICATION WORKFLOW');
  console.log('Testing Stages 1, 2, 3 with Distinct Companies & Inputs');
  console.log('================================================================\n');

  const testCases = [
    // -------------------------------------------------------------
    // STAGE 1: OFFER LETTERS
    // -------------------------------------------------------------
    {
      stage: 'STAGE 1 (Offer Letter)',
      company: 'TechCorp Systems (Predatory / Traps)',
      documentTypeHint: 'OFFER_LETTER',
      text: `CONFIDENTIAL EMPLOYMENT AGREEMENT - TECHCORP SYSTEMS
Dear Candidate,
We are pleased to offer you the position of Senior Platform Engineer at TechCorp Systems.
Compensation: Base salary of $130,000 per annum, payable semi-monthly. No signing bonus.
Intellectual Property: You agree that all inventions, designs, source code, and intellectual property created by you during your employment, whether during business hours or off-hours, on company devices or personal devices, and whether or not related to the company's business, shall be the sole and exclusive property of TechCorp Systems.
Non-Compete: For a period of 24 consecutive months following termination of employment for any reason, you shall not directly or indirectly engage in, work for, consult with, or own any competing software enterprise anywhere in the world.
Equity: Subject to Board approval, you will be granted 10,000 stock options vesting over 4 years with a 1-year cliff. Acceleration is not provided upon change of control.
Employment is strictly at-will. Offer expires within 5 business days.`
    },
    {
      stage: 'STAGE 1 (Offer Letter)',
      company: 'Innovate Labs (Employee-Favorable)',
      documentTypeHint: 'OFFER_LETTER',
      text: `OFFER OF EMPLOYMENT - INNOVATE LABS INC.
Dear Alex,
Innovate Labs is thrilled to offer you the role of Principal Architect.
Compensation:
- Base Salary: $195,000 per year.
- Signing Bonus: $30,000 payable on your first payroll.
- Annual Wellness & Learning Stipend: $4,000 per year ($333/month).
Equity: 25,000 stock options vesting monthly over 4 years, with full Double-Trigger Acceleration (100% accelerated vesting upon acquisition and termination without cause).
Intellectual Property & Side Projects: The Company respects employee creative freedom. An explicit Exhibit A Schedule of Prior Inventions is attached. All personal projects developed solely on personal time and personal equipment without company resources remain 100% your property.
Non-Compete: No non-compete clause is imposed.
Start Date: November 15, 2026. Please confirm acceptance within 10 business days.`
    },

    // -------------------------------------------------------------
    // STAGE 2: POLICY HANDBOOKS
    // -------------------------------------------------------------
    {
      stage: 'STAGE 2 (Handbook)',
      company: 'Apex Global Industries (Punitive / Restrictive)',
      documentTypeHint: 'POLICY_HANDBOOK',
      text: `APEX GLOBAL INDUSTRIES - EMPLOYEE POLICY MANUAL
Section 2: Outside Employment & Moonlighting
Employees are strictly prohibited from engaging in any outside employment, freelance consulting, or secondary business ventures during their tenure with Apex Global Industries.
Section 3: Allowances & Reimbursements
The company provides up to $500 per year for ergonomic supplies. Receipts must be submitted before December 15th. Unclaimed amounts do not roll over and are forfeited.
Section 4: Retirement
401(k) plan is offered with 2% employer matching after 1 year of continuous service.
Section 5: Paid Time Off & Resignation
Employees accrue 10 days of PTO per calendar year. Use-it-or-lose-it policy applies; unused leave does not roll over. Employees serving their notice period are strictly prohibited from using accrued PTO to shorten their notice period.
Section 6: Surveillance & Monitoring
The company reserves the right to conduct keystroke logging and continuous digital monitoring on all employee workstations.`
    },
    {
      stage: 'STAGE 2 (Handbook)',
      company: 'Zenith Innovations (Generous / Clean)',
      documentTypeHint: 'POLICY_HANDBOOK',
      text: `ZENITH INNOVATIONS - COMPREHENSIVE TEAM PLAYBOOK & BENEFITS GUIDE
Welcome to Zenith Innovations!
Section 3.1: Annual Wellness & Health Stipend
Every team member receives up to $2,400 per year ($200/month) for fitness memberships, biometric health wearables, yoga classes, and ergonomic home office upgrades.
Section 3.2: Professional Learning & Tuition Fund
We invest in your growth with a $3,000 per year learning stipend for technical certifications, academic courses, and industry conferences with manager approval.
Section 4.1: Retirement Wealth Building
Zenith provides a 100% dollar-for-dollar 401(k) matching up to 6% of your base salary. All matching contributions vest immediately from Day 1.
Section 5.2: Generous Leave & PTO Encashment
Employees receive 25 days of paid time off per year. Unused leave may roll over up to 10 days, or employees may elect to encash up to 15 days of accrued PTO at full base salary during the annual December window.
Section 6: Personal Side Projects
Zenith champions open source and side projects. Outside projects created on personal time and personal equipment are welcomed.`
    },

    // -------------------------------------------------------------
    // STAGE 3: LAYOFF NOTICES
    // -------------------------------------------------------------
    {
      stage: 'STAGE 3 (Layoff Notice)',
      company: 'Delta Logistics Corp (Substandard Package)',
      documentTypeHint: 'TERMINATION_NOTICE',
      text: `CONFIDENTIAL SEPARATION AGREEMENT AND RELEASE - DELTA LOGISTICS CORP
To: Marcus Vance
Date: October 14, 2026
Dear Marcus,
Due to organizational restructuring, your position as Senior Operations Lead is being eliminated effective October 31, 2026. You have completed 4 years of continuous service.
Severance Consideration: Delta Logistics offers you a lump-sum severance payment of $6,000 USD (equivalent to 2 weeks of base salary), contingent upon signing this General Release of Claims within 7 business days.
Healthcare: Company-subsidized medical coverage terminates on October 31, 2026. You may elect COBRA at your own expense.
Stock Options: You hold 20,000 vested stock options. Under the Plan, you have a 90-day post-termination exercise window ending January 29, 2027, after which all unexercised options shall be forfeited.
Unused PTO: Any accrued PTO payout is subject to administrative calculation.`
    },
    {
      stage: 'STAGE 3 (Layoff Notice)',
      company: 'Beacon Software Inc (Enhanced Package)',
      documentTypeHint: 'TERMINATION_NOTICE',
      text: `SEPARATION NOTICE & TRANSITION PACKAGE - BEACON SOFTWARE INC
To: Sarah Chen
Date: November 1, 2026
Dear Sarah,
As part of our workforce consolidation, we regret to inform you that your employment will end on November 15, 2026, after 2 years of service.
Severance Package:
- Severance Pay: Beacon Software will provide 16 weeks of base salary ($48,000 USD lump sum).
- Healthcare Continuation: Beacon will subsidize 100% of your COBRA medical and dental premiums for 6 months through May 15, 2027.
- Equity & PTE Extension: To honor your contribution, the Board has approved extending your Post-Termination Exercise (PTE) window on your 8,000 vested options to 1 full year (November 15, 2027).
- PTO Payout: 100% of your 18 accrued unused PTO days ($8,300 USD) will be liquidated and paid on your final paycheck.
Please review and execute within 21 calendar days.`
    }
  ];

  const results = [];

  for (const tc of testCases) {
    console.log(`Analyzing: [${tc.stage}] Company: ${tc.company}...`);
    const startTime = Date.now();

    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: tc.text,
        documentTypeHint: tc.documentTypeHint
      })
    });

    const duration = Date.now() - startTime;
    if (!res.ok) {
      console.error(`❌ HTTP ${res.status} for ${tc.company}`);
      const err = await res.text();
      console.error(err);
      continue;
    }

    const data = await res.json();

    // Metric Calculations
    const healthScore = data.healthScore;
    const riskLevel = data.riskLevel;
    const redFlagsCount = data.redFlags ? data.redFlags.length : 0;
    const criticalFlagsCount = data.redFlags ? data.redFlags.filter(f => f.severity === 'CRITICAL').length : 0;
    const totalUnclaimedFormatted = calculateTotalUnclaimedFormatted(data.unclaimedValueOrBenefits);
    const deadlinesCount = data.criticalDeadlines ? data.criticalDeadlines.length : 0;
    const radarDimensionsCount = data.powerBalanceDimensions ? data.powerBalanceDimensions.length : 0;

    results.push({
      stage: tc.stage,
      company: tc.company,
      docType: data.documentType,
      healthScore: `${healthScore}/100`,
      riskLevel: riskLevel,
      redFlags: `${redFlagsCount} (${criticalFlagsCount} crit)`,
      unclaimed: totalUnclaimedFormatted,
      deadlines: deadlinesCount,
      radarDimensions: radarDimensionsCount,
      dimensionsSample: data.powerBalanceDimensions?.map(d => `${d.dimension}: ${d.score} vs ${d.benchmark}`).join(' | '),
      duration: `${duration}ms`
    });
  }

  console.log('\n================================================================');
  console.log('STAGE 1, 2, 3 METRIC RESULTS SUMMARY');
  console.log('================================================================');
  console.table(results.map(r => ({
    Stage: r.stage,
    Company: r.company.split(' ')[0],
    DocType: r.docType,
    Score: r.healthScore,
    Risk: r.riskLevel,
    RedFlags: r.redFlags,
    Unclaimed: r.unclaimed,
    Deadlines: r.deadlines,
    RadarDims: r.radarDimensions,
    Latency: r.duration
  })));

  console.log('\nDetailed Radar Dimensions per Test:');
  for (const r of results) {
    console.log(`\n📌 [${r.stage}] ${r.company}`);
    console.log(`   Health: ${r.healthScore} (${r.riskLevel}) | Red Flags: ${r.redFlags} | Unclaimed: ${r.unclaimed} | Deadlines: ${r.deadlines}`);
    console.log(`   Dimensions: ${r.dimensionsSample}`);
  }

  // -------------------------------------------------------------
  // TEST CHAT ENDPOINT (Stage 2 Policy Oracle)
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('TESTING POLICY ORACLE CHAT ENDPOINT (/api/chat)');
  console.log('================================================================');

  const handbookContext = testCases[3].text; // Zenith Innovations handbook
  const chatQueries = [
    'How much is the annual wellness stipend and what does it cover?',
    'What is the 401(k) matching percentage and vesting period?',
    'Can I work on personal open source side projects?'
  ];

  for (const q of chatQueries) {
    console.log(`\nQuestion: "${q}"`);
    const chatRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: q }],
        documentContext: handbookContext
      })
    });

    if (chatRes.ok) {
      const chatData = await chatRes.json();
      console.log(`Citation: ${chatData.citation || 'N/A'}`);
      console.log(`Response: ${chatData.content.slice(0, 200)}...`);
    } else {
      console.error(`❌ Chat error: ${chatRes.status}`);
    }
  }

  console.log('\n================================================================');
  console.log('✅ ALL VERIFICATIONS COMPLETED');
  console.log('================================================================');
}

runVerification().catch(console.error);
