import { DocumentAnalysisResponse } from './types';

export const SAMPLE_OFFER_LETTER = `ACME CLOUD TECHNOLOGIES INC.
OFFER OF EMPLOYMENT - PRIVATE & CONFIDENTIAL

Date: October 14, 2025
Candidate: Alex Morgan
Position: Senior Full-Stack Software Engineer

1. COMPENSATION & COMMENCEMENT
Base Salary: $148,000 USD per annum, payable bi-weekly.
Commencement Date: November 17, 2025.

2. EQUITY INCENTIVE
Subject to Board approval, you will be granted an option to purchase 16,000 shares of Common Stock.
Vesting Schedule: 4-year vesting with a 1-year cliff (25% vesting after 12 months, followed by standard monthly vesting).

3. SECTION 7: PROPRIETARY INFORMATION & IP ASSIGNMENT (CRITICAL CLAUSE)
The Employee agrees that all inventions, designs, computer code, developments, concepts, and discoveries
conceived, developed, or reduced to practice by the Employee—whether during regular working hours or off-hours,
whether on Company-owned equipment or personal devices, and whether or not related to the Company’s current or
contemplated business—shall be the sole and exclusive property of Acme Cloud Technologies Inc.
The Employee hereby waives all moral rights and assigns all global copyright and patent claims to the Company.

4. SECTION 9: NON-COMPETITION & NON-SOLICITATION
During the term of employment and for a period of twenty-four (24) consecutive months following termination
of employment for any reason, the Employee shall not directly or indirectly engage in, perform services for,
consult with, or advise any enterprise, venture, or company operating in the cloud computing, enterprise software,
or distributed systems industries anywhere worldwide.

5. AT-WILL EMPLOYMENT
Employment with the Company is for no specified period and constitutes at-will employment under applicable law.`;

export const SAMPLE_LAYOFF_NOTICE = `NEXUS DYNAMICS CORP.
NOTICE OF SEPARATION AND CONDITIONAL RELEASE AGREEMENT

Date: March 12, 2026
Employee: Jordan Lee
Role: Lead Product Architect (Tenure: 3 Years, 4 Months)

Dear Jordan,
Due to enterprise-wide organizational restructuring, this letter serves as formal notice that your
employment with Nexus Dynamics Corp. will conclude effective March 20, 2026.

1. SEVERANCE PAYMENT
Subject to your execution and non-revocation of this Release Agreement within 5 business days, the Company
will provide a lump-sum severance payment equivalent to two (2) weeks of your base salary ($5,769.23 USD),
less applicable tax withholdings.

2. EQUITY & STOCK OPTIONS
You currently hold 12,500 vested options under the 2022 Equity Incentive Plan. Under Company policy, your
Post-Termination Exercise (PTE) period is strictly ninety (90) calendar days from your separation date.
Any options not exercised in cash by June 18, 2026, will automatically be forfeited and returned to the pool.

3. HEALTH BENEFITS & ACCRUED LEAVE
Company-subsidized medical coverage terminates on March 31, 2026. You will receive standard COBRA continuation
election notices at your own expense. Payout of any accrued, unused Paid Time Off (PTO) remains subject to
administrative review and verification.

4. RELEASE OF ALL CLAIMS
By signing below, you irrevocably release and forever discharge the Company, its officers, and affiliates
from any and all claims, demands, or liabilities of any nature whatsoever.`;

export const SAMPLE_EMPLOYEE_HANDBOOK = `GLOBAL TECH DYNAMICS — EMPLOYEE HANDBOOK & BENEFITS GUIDE (2025-2026)

CHAPTER 3: HEALTH, WELLNESS & CONTINUOUS LEARNING
Section 3.1: Annual Wellness & Fitness Allowance
All full-time employees are eligible for an annual health and wellness reimbursement of up to $1,200 per calendar year ($100/month).
This benefit covers gym memberships, home fitness equipment, ergonomics, mental health apps, and biometric trackers.
Claims must be submitted via the expense portal by December 15th of each calendar year. Unclaimed allowances do not roll over to the subsequent year.

Section 3.4: Professional Development & Learning Stipend
To foster continuous growth, the Company provides a $1,500 annual tuition and learning stipend per employee.
Permissible expenses include accredited technical certifications (AWS, GCP, CKA), software engineering books, and tech conference admissions.
Approval requires manager sign-off prior to course enrollment.

CHAPTER 5: TIME OFF, LEAVES & ENCASHMENT
Section 5.2: Paid Time Off (PTO) Accrual and Carryover
Full-time personnel accrue 20 days of Paid Time Off annually (1.66 days per month). A maximum of 5 unused days may roll over into the next calendar year.
Section 5.3: Annual PTO Encashment Option
Employees who maintain a minimum active reserve of 10 days may encash up to 15 days of unused accrued PTO at their current base rate at the conclusion of the fiscal year (December 31st). Encashment requests must be submitted during the annual Open Enrollment window.

Section 5.8: Leave During Notice Period
Employees serving a voluntary or involuntary notice period are strictly prohibited from utilizing accrued PTO to shorten the contractual notice duration, unless authorized in writing by the Department Vice President and People Operations.

CHAPTER 7: RETIREMENT & FINANCIAL WELLNESS
Section 7.2: 401(k) / Provident Fund Employer Matching
The Company matches employee 401(k) contributions dollar-for-dollar up to 5% of gross base salary.
Matching contributions vest immediately from Day 1 of employment. Employees may update their elective deferral percentage at any time through the payroll portal.

CHAPTER 9: SEPARATION & SEVERANCE GUIDELINES
Section 9.4: Standard Severance Calculations
In the event of a non-performance separation or organizational redundancy, standard severance guidelines recommend two (2) to four (4) weeks of base pay per completed year of service, subject to executive discretion and execution of a mutual non-disparagement agreement.`;

export const MOCK_OFFER_LETTER_ANALYSIS: DocumentAnalysisResponse = {
  documentType: 'OFFER_LETTER',
  healthScore: 44,
  riskLevel: 'HIGH',
  summary: 'This offer contains aggressive IP ownership over personal off-hours creations and an overly broad 24-month worldwide non-compete that severely restricts future career mobility.',
  powerBalanceDimensions: [
    { dimension: 'IP Freedom', score: 18, benchmark: 70, description: 'Predatory 24/7 claim over personal off-hours creations' },
    { dimension: 'Career Mobility', score: 12, benchmark: 65, description: '24-month worldwide non-compete severely restricts options' },
    { dimension: 'Equity Safety', score: 45, benchmark: 60, description: 'Standard 4-yr vesting but missing double-trigger acceleration' },
    { dimension: 'Exit Terms', score: 40, benchmark: 55, description: 'Pure at-will employment with no severance guarantees' },
    { dimension: 'Perks & Value', score: 68, benchmark: 75, description: 'Competitive base salary ($148k) but missing sign-on bonus' },
  ],
  redFlags: [
    {
      clauseTitle: 'Section 7: 24/7 Off-Hours Intellectual Property Assignment',
      quotedText: 'whether during regular working hours or off-hours, whether on Company-owned equipment or personal devices, and whether or not related to the Company’s current or contemplated business',
      issueExplanation: 'The employer is claiming total ownership of any software or side project you develop on your own time, using your personal laptop, even if completely unrelated to the company.',
      severity: 'CRITICAL',
      recommendation: 'Request a carve-out rider specifically excluding pre-existing inventions and off-hours projects created on personal equipment without company confidential data.'
    },
    {
      clauseTitle: 'Section 9: 24-Month Worldwide Non-Competition Restriction',
      quotedText: 'for a period of twenty-four (24) consecutive months following termination... anywhere worldwide',
      issueExplanation: 'A 2-year worldwide ban in cloud computing and enterprise software is excessively punitive, likely unenforceable in many jurisdictions (e.g., California/FTC rules), but creates substantial legal intimidation.',
      severity: 'CRITICAL',
      recommendation: 'Negotiate striking this clause entirely or narrowing it to a 6-month period confined strictly to direct named competitors within a 50-mile radius.'
    },
    {
      clauseTitle: 'Section 2: Missing Double-Trigger Equity Acceleration',
      quotedText: '4-year vesting with a 1-year cliff (25% vesting after 12 months)',
      issueExplanation: 'While standard, there is no single or double-trigger acceleration protection. If Acme is acquired in month 11 and your role is terminated, you forfeit 100% of your equity.',
      severity: 'WARNING',
      recommendation: 'Request standard double-trigger acceleration (100% vesting of unvested shares if terminated without cause within 12 months of a Change in Control).'
    }
  ],
  unclaimedValueOrBenefits: [
    {
      title: 'Sign-On / Relocation Bonus Missing',
      estimatedValue: '$10,000 – $20,000',
      actionRequired: 'Market benchmark for Senior Full-Stack roles at $148k base typically includes a $10k-$15k upfront signing bonus.'
    },
    {
      title: 'Annual Professional Development Stipend',
      estimatedValue: '$1,500 – $3,000/year',
      actionRequired: 'Request explicit written inclusion of annual equipment and educational conference allowances.'
    }
  ],
  criticalDeadlines: [
    {
      event: 'Offer Expiration / Acceptance Window',
      timeframe: 'Typically 5-7 business days',
      impact: 'Counters must be dispatched promptly prior to signing any binding electronic signatures.'
    },
    {
      event: 'Commencement Date',
      timeframe: 'November 17, 2025',
      impact: 'Notice period with your current employer must be coordinated to prevent gap or overlapping employment.'
    }
  ],
  redlines: [
    {
      clauseTitle: 'Intellectual Property & Personal Inventions Assignment',
      sectionNumber: 'Section 7',
      originalText: 'The Employee agrees that all inventions, designs, computer code, developments, concepts, and discoveries conceived, developed, or reduced to practice by the Employee—whether during regular working hours or off-hours, whether on Company-owned equipment or personal devices, and whether or not related to the Company’s current or contemplated business—shall be the sole and exclusive property of Acme Cloud Technologies Inc.',
      strikeThroughText: 'whether during regular working hours or off-hours, whether on Company-owned equipment or personal devices, and whether or not related to the Company’s current or contemplated business',
      amendedText: 'solely during regular working hours and utilizing Company-owned equipment, provided such inventions relate directly to the Company’s actual business. Any inventions created off-hours on personal equipment without use of Company confidential data, as well as all projects listed on Exhibit A (Prior Inventions), are strictly excluded and remain the sole property of Employee.',
      legalRationale: 'Protects personal open-source projects, personal GitHub repos, and off-hours side ventures from predatory employer capture.'
    },
    {
      clauseTitle: 'Post-Employment Non-Competition Restraint',
      sectionNumber: 'Section 9',
      originalText: 'During the term of employment and for a period of twenty-four (24) consecutive months following termination of employment for any reason, the Employee shall not directly or indirectly engage in, perform services for, consult with, or advise any enterprise, venture, or company operating in the cloud computing, enterprise software, or distributed systems industries anywhere worldwide.',
      strikeThroughText: 'twenty-four (24) consecutive months following termination of employment for any reason... operating in the cloud computing, enterprise software, or distributed systems industries anywhere worldwide.',
      amendedText: 'six (6) consecutive months following termination, the Employee shall not provide services to direct commercial competitors specifically identified in writing upon departure, limited to a 50-mile radius of Employee’s primary work location.',
      legalRationale: 'Replaces an unenforceable, oppressive 2-year global ban with a reasonable, narrowly tailored 6-month covenant.'
    }
  ],
  counterStrategy: {
    keyNegotiationPoints: [
      'Carve out personal side projects and off-hours open source contributions from IP assignment.',
      'Eliminate or restrict the 24-month worldwide non-compete covenant to 6 months for direct competitors.',
      'Add double-trigger acceleration on acquisition and request a $15,000 sign-on bonus.'
    ],
    generatedDraftEmail: `Subject: Alex Morgan — Offer of Employment Discussion & Clarifications (Acme Cloud Technologies)

Dear Hiring Team,

Thank you very much for extending the offer to join Acme Cloud Technologies Inc. as a Senior Full-Stack Software Engineer. I am genuinely excited about the company's technical trajectory in distributed systems and look forward to contributing to the team's mission.

Before formally signing, I reviewed the agreement and would like to propose a few minor adjustments to ensure mutual alignment:

1. Intellectual Property (Section 7): The current wording assigns all off-hours work on personal devices to Acme, even if unrelated to company business. I request adding an Exhibit A / Pre-Existing Inventions Rider to carve out independent off-hours open-source contributions created on personal equipment without use of Acme proprietary information.

2. Non-Competition (Section 9): A 24-month worldwide covenant across all enterprise software is unusually broad. I propose narrowing this to 6 months and limiting its scope strictly to direct commercial competitors in your specific product niche.

3. Equity Acceleration (Section 2): Given the 4-year schedule, I would appreciate inserting standard double-trigger acceleration in the event of an acquisition and subsequent involuntary termination.

I am eager to finalize our agreement and begin on November 17. Thank you for your consideration, and I look forward to your thoughts.

Warm regards,
Alex Morgan`
  }
};

export const MOCK_LAYOFF_NOTICE_ANALYSIS: DocumentAnalysisResponse = {
  documentType: 'TERMINATION_NOTICE',
  healthScore: 28,
  riskLevel: 'HIGH',
  summary: 'High-risk separation agreement offering substandard severance (2 weeks for 3.3 years tenure), an aggressive 90-day stock option forfeiture cliff, and ambiguous PTO payout terms.',
  powerBalanceDimensions: [
    { dimension: 'IP Freedom', score: 85, benchmark: 70, description: 'Standard release without post-employment IP overreach' },
    { dimension: 'Career Mobility', score: 65, benchmark: 65, description: 'Release does not introduce new post-termination non-compete' },
    { dimension: 'Equity Safety', score: 14, benchmark: 60, description: 'Aggressive 90-day forfeiture cliff on 12,500 vested options' },
    { dimension: 'Exit Terms', score: 15, benchmark: 55, description: '2 weeks severance offered vs. 14 weeks industry standard' },
    { dimension: 'Perks & Value', score: 25, benchmark: 75, description: 'Abrupt healthcare cutoff and ambiguous PTO liquidation' },
  ],
  redFlags: [
    {
      clauseTitle: 'Section 1: Substandard Severance Discrepancy',
      quotedText: 'lump-sum severance payment equivalent to two (2) weeks of your base salary ($5,769.23 USD)',
      issueExplanation: 'Offering 2 weeks of severance for over 3 years and 4 months of dedicated tenure is well below industry standard (which is typically 1 to 2 months per year of tenure, or 12-14 weeks for Jordan\'s tenure).',
      severity: 'CRITICAL',
      recommendation: 'Counter-request 14 weeks of severance pay ($40,384 USD) based on 3.3 years of senior tenure and performance contributions.'
    },
    {
      clauseTitle: 'Section 2: 90-Day Post-Termination Exercise (PTE) Option Cliff',
      quotedText: 'PTE period is strictly ninety (90) calendar days from your separation date. Any options not exercised in cash by June 18, 2026, will automatically be forfeited',
      issueExplanation: '12,500 vested options will evaporate in 90 days unless you have tens of thousands of dollars in cash for exercise costs and tax liabilities while unemployed.',
      severity: 'CRITICAL',
      recommendation: 'Request an extension of the PTE window from 90 days to 1 year (or 5-7 years, as adopted by modern tech leaders).'
    },
    {
      clauseTitle: 'Section 3: Ambiguous PTO Payout & Abrupt Health Cutoff',
      quotedText: 'Payout of any accrued, unused Paid Time Off (PTO) remains subject to administrative review... medical coverage terminates on March 31, 2026',
      issueExplanation: 'The agreement does not commit to paying out your earned PTO balance and ceases subsidized healthcare in less than 3 weeks, leaving you with immediate COBRA premiums.',
      severity: 'WARNING',
      recommendation: 'Demand immediate written calculation and full payout of earned PTO, plus company-paid COBRA subsidies through the end of the quarter (June 30, 2026).'
    }
  ],
  unclaimedValueOrBenefits: [
    {
      title: 'Severance Deficit (Market Tenure Standard)',
      estimatedValue: '$34,615 USD (12 additional weeks)',
      actionRequired: 'Request formal adjustment to 1 month per year of service.'
    },
    {
      title: 'Company-Paid COBRA Healthcare Extension',
      estimatedValue: '$2,400 – $4,800 (3 months coverage)',
      actionRequired: 'Request Nexus cover monthly health premiums through June 30, 2026.'
    },
    {
      title: 'Accrued Unused PTO Liquidation',
      estimatedValue: '$4,000 – $8,000 (est. 10-15 days)',
      actionRequired: 'Require explicit payout figure before signing release.'
    }
  ],
  criticalDeadlines: [
    {
      event: 'Execution & Consideration Deadline',
      timeframe: '5 business days (March 19, 2026)',
      impact: 'Do NOT sign on Day 1. Under legal standards, you have the right to request a 21-day review window.'
    },
    {
      event: 'Healthcare Cutoff Date',
      timeframe: 'March 31, 2026',
      impact: 'Subsidized health insurance ceases; high-cost COBRA must be elected within 60 days.'
    },
    {
      event: 'Stock Option Forfeiture Cliff',
      timeframe: 'June 18, 2026 (90 Days Post-Separation)',
      impact: '12,500 vested shares will be permanently cancelled without exercise extension.'
    }
  ],
  redlines: [
    {
      clauseTitle: 'Severance Consideration & Tenure Alignment',
      sectionNumber: 'Section 1',
      originalText: 'the Company will provide a lump-sum severance payment equivalent to two (2) weeks of your base salary ($5,769.23 USD), less applicable tax withholdings.',
      strikeThroughText: 'two (2) weeks of your base salary ($5,769.23 USD)',
      amendedText: 'fourteen (14) weeks of your base salary ($40,384.61 USD), calculated at one month of severance per completed year of dedicated service',
      legalRationale: 'Aligns severance with market standards for 3.3 years senior tenure and organizational redundancy.'
    },
    {
      clauseTitle: 'Stock Option Post-Termination Exercise Window Extension',
      sectionNumber: 'Section 2',
      originalText: 'Under Company policy, your Post-Termination Exercise (PTE) period is strictly ninety (90) calendar days from your separation date. Any options not exercised in cash by June 18, 2026, will automatically be forfeited and returned to the pool.',
      strikeThroughText: 'strictly ninety (90) calendar days from your separation date. Any options not exercised in cash by June 18, 2026, will automatically be forfeited',
      amendedText: 'extended to three hundred sixty-five (365) calendar days (one full year) through March 20, 2027, to afford Employee reasonable time to arrange financing without punitive forfeiture',
      legalRationale: 'Prevents immediate financial devastation and protects $50k+ in earned equity value.'
    },
    {
      clauseTitle: 'Healthcare Continuation & Accrued PTO Verification',
      sectionNumber: 'Section 3',
      originalText: 'Company-subsidized medical coverage terminates on March 31, 2026... Payout of any accrued, unused Paid Time Off (PTO) remains subject to administrative review and verification.',
      strikeThroughText: 'terminates on March 31, 2026... remains subject to administrative review and verification.',
      amendedText: 'shall remain 100% subsidized by the Company through June 30, 2026 (the conclusion of the fiscal quarter). Full payout of all accrued, unused PTO (verified at 14.5 days) shall be disbursed on the separation date.',
      legalRationale: 'Eliminates healthcare lapse vulnerability during transition and guarantees earned statutory wage payout.'
    }
  ],
  counterStrategy: {
    keyNegotiationPoints: [
      'Extend 90-day option exercise window to at least 1 year to preserve $50k+ in earned equity value.',
      'Increase severance from 2 weeks to 14 weeks ($40,384) reflecting 3.3 years of exemplary service.',
      'Cover COBRA healthcare premiums through June 30, 2026 and guarantee full accrued PTO payout.'
    ],
    generatedDraftEmail: `Subject: Separation Agreement Discussion — Jordan Lee (Confidential)

Dear People Operations and Nexus Leadership,

I am writing to discuss the Separation Agreement provided on March 12, 2026. While I understand that enterprise organizational restructuring necessitated this difficult decision, I believe the current terms do not adequately reflect my 3 years and 4 months of dedicated contributions as Lead Product Architect.

To achieve an equitable and amicable separation, and in exchange for executing a full release of claims and providing comprehensive transition assistance, I respectfully propose the following modifications:

1. Severance Consideration (Section 1): The currently proposed two (2) weeks of severance is significantly below market standards for over 3 years of senior tenure. I request an adjustment to fourteen (14) weeks of base pay ($40,384.61 USD), consistent with one month per year of service.

2. Stock Option Exercise Extension (Section 2): The ninety (90) day Post-Termination Exercise period imposes an extreme financial hardship to exercise 12,500 vested options while transitioning. I request an amendment extending my PTE window to one (1) full year from the separation date.

3. Health Coverage & PTO (Section 3): I request that Nexus Dynamics continue company-subsidized medical coverage through June 30, 2026, and provide an explicit accounting and full payout of all accrued, unused Paid Time Off on my final paycheck.

I remain committed to ensuring a seamless handover of all architectural documentation and ongoing projects. I am prepared to sign the amended agreement promptly upon receipt.

Thank you for your understanding and continued support during this transition.

Sincerely,
Jordan Lee`
  }
};

export const MOCK_HANDBOOK_ANALYSIS: DocumentAnalysisResponse = {
  documentType: 'POLICY_HANDBOOK',
  healthScore: 86,
  riskLevel: 'LOW',
  summary: 'Comprehensive, employee-friendly policy guide with substantial unclaimed monetary benefits ($2,700+/year in stipends), a generous 15-day PTO encashment rule, and a 5% 401(k) match.',
  powerBalanceDimensions: [
    { dimension: 'IP Freedom', score: 80, benchmark: 70, description: 'Clear boundaries between company IP and personal development' },
    { dimension: 'Career Mobility', score: 75, benchmark: 65, description: 'Standard notice periods without punitive non-competes' },
    { dimension: 'Equity Safety', score: 70, benchmark: 60, description: 'Documented vesting and transparent equity grant mechanisms' },
    { dimension: 'Exit Terms', score: 65, benchmark: 55, description: 'Clear 2-4 week severance guidance per year of tenure' },
    { dimension: 'Perks & Value', score: 94, benchmark: 75, description: '$1,200 wellness + $1,500 tuition + 15-day PTO encashment' },
  ],
  redFlags: [
    {
      clauseTitle: 'Section 5.8: Notice Period PTO Prohibition',
      quotedText: 'Employees serving a voluntary or involuntary notice period are strictly prohibited from utilizing accrued PTO to shorten the contractual notice duration',
      issueExplanation: 'If you submit your resignation, you cannot use your accumulated leave days to take time off or leave earlier unless you obtain VP-level written approval.',
      severity: 'NOTE',
      recommendation: 'If planning a departure, encash or take allowable PTO before formally submitting your written resignation notice.'
    },
    {
      clauseTitle: 'Section 3.1: Use-It-Or-Lose-It Wellness Deadline',
      quotedText: 'Claims must be submitted via the expense portal by December 15th... Unclaimed allowances do not roll over',
      issueExplanation: 'The $1,200 annual wellness benefit expires strictly on Dec 15th every year without carryover.',
      severity: 'WARNING',
      recommendation: 'Set a calendar reminder for November 1st to submit all eligible fitness, gym, and mental health receipts.'
    }
  ],
  unclaimedValueOrBenefits: [
    {
      title: 'Annual Health & Wellness Stipend (Sec 3.1)',
      estimatedValue: '$1,200 / year ($100/mo)',
      actionRequired: 'Submit gym, biometric tracker, or ergonomic claims before December 15th.'
    },
    {
      title: 'Professional Learning & Tuition Stipend (Sec 3.4)',
      estimatedValue: '$1,500 / year',
      actionRequired: 'Obtain manager pre-approval for technical certifications, conferences, or courses.'
    },
    {
      title: 'Annual PTO Encashment Option (Sec 5.3)',
      estimatedValue: 'Up to 15 Days Base Salary',
      actionRequired: 'Maintain 10 days reserve and apply during the annual Open Enrollment window.'
    },
    {
      title: '401(k) Employer Dollar-for-Dollar Match (Sec 7.2)',
      estimatedValue: '5% of Gross Base Salary (Immediate 100% Vesting)',
      actionRequired: 'Ensure elective deferral in payroll portal is set to at least 5% to capture full employer match.'
    }
  ],
  criticalDeadlines: [
    {
      event: 'Wellness Reimbursement Submission Deadline',
      timeframe: 'December 15th Annually',
      impact: 'Unsubmitted receipts for the $1,200 wellness allowance will be permanently lost.'
    },
    {
      event: 'PTO Encashment Window',
      timeframe: 'Fiscal Year End (Dec 31st) / Open Enrollment',
      impact: 'Must apply to convert up to 15 unused PTO days into direct cash.'
    },
    {
      event: 'PTO Carryover Ceiling',
      timeframe: 'December 31st',
      impact: 'Only 5 unused PTO days roll over; excess days over 5 will expire if not encashed.'
    }
  ],
  redlines: [
    {
      clauseTitle: 'Notice Period Leave Accommodation',
      sectionNumber: 'Section 5.8',
      originalText: 'Employees serving a voluntary or involuntary notice period are strictly prohibited from utilizing accrued PTO to shorten the contractual notice duration, unless authorized in writing by the Department Vice President and People Operations.',
      strikeThroughText: 'strictly prohibited from utilizing accrued PTO to shorten the contractual notice duration',
      amendedText: 'entitled to utilize up to 50% of accrued unused PTO during notice periods with direct manager approval, or receive equivalent lump-sum cash liquidation on final paycheck.',
      legalRationale: 'Provides flexibility for transitioning employees and avoids forfeiture of accrued compensation.'
    }
  ],
  counterStrategy: {
    keyNegotiationPoints: [
      'Claim your full $100/month wellness allowance ($1,200/year) before the strict Dec 15 deadline.',
      'Maximize retirement wealth by ensuring your 401(k) contribution is at least 5% to claim the 100% match.',
      'Encash up to 15 days of accrued PTO at year-end rather than losing days past the 5-day rollover limit.'
    ],
    generatedDraftEmail: `Subject: Inquiry regarding PTO Encashment & Annual Learning Stipend — [Your Name]

Dear People Operations Team,

I am reviewing my annual benefits under the Employee Handbook and would like to confirm two items:

1. Section 5.3 (PTO Encashment): I currently maintain over 10 days in reserve and would like to confirm the procedure to encash my eligible unused PTO days prior to the fiscal year close.
2. Section 3.4 (Learning Stipend): I am preparing to enroll in an advanced technical certification and would like to confirm the manager pre-approval form to utilize my $1,500 annual allowance.

Thank you for your guidance!

Best regards,
[Your Name]`
  }
};
