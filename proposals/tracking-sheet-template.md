---
title: "[Business Name] - Lead Tracking Sheet Template"
created: 2026-06-08
stage: "planning"
tags: [lead-gen, tracking, roi, template]
source: Eye Console workflow
---

# [Business Name] Lead Tracking Sheet Template

Copy this structure into Google Sheets. Formulas included for quick ROI.

## Columns (copy row 1 as header)

| Date Received | Lead Source | Name | Phone | Email | [Qualifying Field e.g. Zip / Company / Challenge] | Lead Type / Interest | Timeline | Tier / Package Quoted | Appointment / Next Step Booked? | Closed / Converted? | Revenue | Cost Per Lead (est) | Notes / Next Follow-up | Assigned To |

## Sample Data Rows (delete after setup)

| 2026-06-08 | Landing Page | [Example Name] | (555) 234-9981 | name@email.com | [Example detail] | [Buyer / New Customer / etc.] | 30 days | Tier 2 | Yes | No | - | $72 | Hot lead - wants fast solution | [Your Name] |
| 2026-06-07 | Referral | [Example Name] | (555) 987-1122 | name@email.com | [Example detail] | [Seller / Existing / etc.] | 90 days | Tier 1 | Yes | Yes | $[Amount] | $41 | Closed fast | [Your Name] |

## Key Formulas (add to Google Sheets)

- **Total Leads this month**: `=COUNTA(A:A)-1`
- **Conversion to Appointment**: `=COUNTIF(J:J,"Yes") / (COUNTA(A:A)-1)`
- **Total Revenue Closed**: `=SUMIF(L:L,">0")`
- **Avg Cost Per Lead**: Average of column N
- **ROI**: `(Total Revenue - Total Ad Spend) / Total Ad Spend`

**Monthly Summary Section** (add at bottom or new tab):
- Leads generated
- Appointments / next steps booked
- Closed / converted deals
- Revenue
- Cost per lead
- Close rate
- ROI by source

**Next Actions**:
- [ ] Paste real data weekly
- [ ] Share view-only link with team
- [ ] Set up automated monthly summary email

*Universal template generated via Eye Console workflow. Customize column headers for your industry.*
