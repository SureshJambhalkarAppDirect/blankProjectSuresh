# AppConnectors epic examples (2026 Q1–Q2)

Source: Jira project **AC** (AppConnectors), `appdirect.jira.com`.  
Last 10 epics **created** between 2026-01-01 and 2026-06-30 (calendar Q1–Q2 2026), ordered by `created DESC`.

| # | Key | Created | Summary | Pattern |
|---|-----|---------|---------|---------|
| 1 | [AC-15311](https://appdirect.jira.com/browse/AC-15311) | 2026-06-30 | 2026Q3 - [AC] - Automation improvements for Adobe & Google Features… | Platform |
| 2 | [AC-15275](https://appdirect.jira.com/browse/AC-15275) | 2026-06-18 | [AC][Google] Subscription Type Identification and Pricing Integration | ISV feature |
| 3 | [AC-15243](https://appdirect.jira.com/browse/AC-15243) | 2026-06-03 | 2026Q3 - [AC] - Analysis and Implementation of newly launched Adobe capabilities… | Platform |
| 4 | [AC-15242](https://appdirect.jira.com/browse/AC-15242) | 2026-06-03 | 2026Q3 - [AC] - AppConnectors Stability, Removal of Tech Debt | Platform |
| 5 | [AC-15241](https://appdirect.jira.com/browse/AC-15241) | 2026-06-03 | [Adobe] - Flex Discount - Support for Reusable Discounts | ISV feature |
| 6 | [AC-15240](https://appdirect.jira.com/browse/AC-15240) | 2026-06-03 | [Adobe] - Flex Discount support for Anytime upgrades | ISV feature |
| 7 | [AC-15239](https://appdirect.jira.com/browse/AC-15239) | 2026-06-03 | [Adobe] - Flex Discount support for 3YC customers | ISV feature |
| 8 | [AC-15185](https://appdirect.jira.com/browse/AC-15185) | 2026-05-12 | [Q2 2026] [AC] Enable Subscription Migration for Cisco… | ISV + quarter |
| 9 | [AC-15137](https://appdirect.jira.com/browse/AC-15137) | 2026-04-20 | [Adobe] - Adobe Early Renewal Experience | ISV feature (**gold standard**) |
| 10 | [AC-15054](https://appdirect.jira.com/browse/AC-15054) | 2026-03-22 | 2026Q2 - [AC] - Automation improvements for Adobe & Google Features… | Platform |

## Additional Q1 2026 epics (same cohort)

| Key | Created | Summary |
|-----|---------|---------|
| [AC-15030](https://appdirect.jira.com/browse/AC-15030) | 2026-03-09 | [Adobe][Q2 2026] High Growth Offers (HGO) – Enhancements to current experience |
| [AC-15012](https://appdirect.jira.com/browse/AC-15012) | 2026-03-03 | 2026Q2 - [AC] - AppConnectors Stability, Removal of Tech Debt |
| [AC-15011](https://appdirect.jira.com/browse/AC-15011) | 2026-03-03 | [Adobe] - Flex Discounts as Promotions *(thin — avoid)* |
| [AC-15010](https://appdirect.jira.com/browse/AC-15010) | 2026-03-03 | 2026Q2 - [AC] - Analysis and Implementation of newly launched Adobe capabilities… |
| [AC-14936](https://appdirect.jira.com/browse/AC-14936) | 2026-01-29 | 2026Q1 -[AC] - Adobe Flex Discount Support for the Schedule and Renewal Use Cases |
| [AC-14933](https://appdirect.jira.com/browse/AC-14933) | 2026-01-23 | AppConnectors services deployment on T-Mobile cluster |

## Summary pattern frequency (n=10 above)

| Pattern | Count | Example |
|---------|-------|---------|
| `2026Q{n} - [AC] - {theme}` | 4 | AC-15054 |
| `[Adobe] - {feature}` | 3 | AC-15137 |
| `[AC][{ISV}] {feature}` | 1 | AC-15275 |
| `[Q{n} {year}] [AC] {outcome}` | 1 | AC-15185 |
| Other ISV flex variants | 1 | AC-15241 |

## Description structure frequency

| Structure | Used by | When to use |
|-----------|---------|-------------|
| Full (Problem, Solution, Goals, US, AC, DoD) | AC-15137, AC-15275 | Customer-facing connector features |
| Platform (Scope + Details) | AC-15010, AC-15054, AC-15311 | Automation, stability, Adobe-capabilities bucket |
| Alternate (Problem/Goal/Scope bullets) | AC-15185 | Acceptable for migrations; prefer full template for new features |
| Thin (TBD) | AC-15011 | **Do not use** |

## Label convention

Quarter planning labels observed: `2026q1ac`, `2026q2ac` (lowercase `q`).
