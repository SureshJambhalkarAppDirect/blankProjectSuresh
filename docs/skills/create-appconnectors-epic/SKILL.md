---
name: create-appconnectors-epic
description: Creates Jira Epics in the AppConnectors project (AC) using the team's standard summary naming and description structure derived from 2026 Q1–Q2 epics. Use when creating AC epics, AppConnectors epics, connector feature epics, or when the user asks to draft or file an epic in project AC.
---

# Create AppConnectors (AC) Epic

## Project context

| Item | Value |
|------|-------|
| Jira project key | `AC` |
| Project name | AppConnectors |
| Cloud | `appdirect.jira.com` (`5e3bd104-ccd1-46d7-b2df-0631357628fd`) |
| Issue type | `Epic` |
| Org epic guide | [Epic structure (PROD)](https://appdirect.jira.com/wiki/spaces/PROD/pages/6189547527) |

**Note:** "APPCONNECTORS" refers to the product area; the Jira project key is **`AC`**.

## Workflow

1. **Gather inputs** from the user (or upstream PRD/brief):
   - Epic category: **connector feature**, **platform/recurring**, or **spike/discovery**
   - ISV/vendor (Adobe, Google, Cisco, DocuSign, Internal, …)
   - Delivery quarter (`2026Q1`, `2026Q2`, …) and increment if known
   - Parent Initiative key (if any)
   - Problem, solution, customers, timeline, out-of-scope

2. **Draft summary** using [Summary naming rules](#summary-naming-rules).

3. **Draft description** using the [Standard description template](#standard-description-template). For customer-facing connector features, use the **full** template (include Goals, User stories, Acceptance criteria, Definition of done). For platform/automation buckets, use the **platform** variant.

4. **Present draft** to the user for approval before creating in Jira.

5. **Create in Jira** via Atlassian MCP `createJiraIssue`:

```text
createJiraIssue(
  cloudId="5e3bd104-ccd1-46d7-b2df-0631357628fd",
  projectKey="AC",
  issueTypeName="Epic",
  summary="<drafted summary>",
  description="<markdown body>",
  contentFormat="markdown",
  additional_fields={
    "customfield_10851": "<Epic Name — usually matches summary>",
    "customfield_26362": {"value": "2026Q2"},
    "customfield_26360": [{"value": "Internal"}],
    "customfield_33010": {"value": "2026 Q2B"},
    "labels": ["2026q2ac"],
    "priority": {"name": "Major"},
    "parent": "<PARENT-INITIATIVE-KEY if portfolio parent>"
  }
)
```

6. **Return** the epic key and browse URL: `https://appdirect.jira.com/browse/AC-#####`

### Required Jira fields (AC Epic)

| Field | API key | Notes |
|-------|---------|-------|
| Epic Name | `customfield_10851` | Match summary |
| Delivery Quarter | `customfield_26362` | `2026Q1`, `2026Q2`, `2026Q3`, `2026Q4`, or `Backlog` |
| Include on Roadmap? | `customfield_26360` | **Required.** `Internal` and/or `External` |
| Increment | `customfield_33010` | e.g. `2026 Q1B`, `2026 Q2B`, `2026 Q3A` |
| T-shirt size | `customfield_22601` | Set when known (XS–XXXL) |
| Business Area | `customfield_26364` | e.g. `Digital Initiative`, `Provider` |
| Labels | `labels` | Quarter tag: `2026q1ac`, `2026q2ac`, etc. |

Use `getJiraIssueTypeMetaWithFields` if field IDs change.

## Summary naming rules

Pick **one** pattern based on epic type:

### Connector / ISV feature (preferred for net-new capability)

```text
[{ISV}] - {Outcome or capability name}
```

Examples: `[Adobe] - Adobe Early Renewal Experience`, `[Adobe] - Flex Discounts as Promotions`

Variants:

```text
[{ISV}][Q{n} {year}] {Capability} – {qualifier}
[Q{n} {year}] [AC] {Outcome for ISV or workflow}
[AC][{ISV}] {Capability}
```

Examples:

- `[Adobe][Q2 2026] High Growth Offers (HGO) – Enhancements to current experience`
- `[Q2 2026] [AC] Enable Subscription Migration for Cisco — Support Partner Migration Workflows`
- `[AC][Google] Subscription Type Identification and Pricing Integration`

### Platform / recurring quarter epics

```text
2026Q{n} - [AC] - {Theme}
```

Examples:

- `2026Q2 - [AC] - AppConnectors Stability, Removal of Tech Debt`
- `2026Q2 - [AC] - Automation improvements for Adobe & Google Features and cross domain purchase flows`
- `2026Q2 - [AC] - Analysis and Implementation of newly launched Adobe capabilities within the quarter`

**Do not** create title-only or "TBD" epics. Minimum: problem + approach + scope bullets.

## Standard description template

Use this structure in the Jira description (markdown). It matches the strongest 2026 AC epics (e.g. [AC-15137](https://appdirect.jira.com/browse/AC-15137)).

### Full template (connector features — use before eng kickoff)

```markdown
## Summary

#### Problem description

[What is broken or missing today — observable behavior, partner/customer impact. Quantify when possible.]

#### Solution description

[Epic-level capability being delivered. Name channels (Assisted Sales, API/headless, self-serve). List major flows or capabilities as numbered/bulleted items. Call out scope constraints explicitly.]

#### Impacted customers

[Named partners or segment — e.g. ACP, Cancom, Softchoice — or "All commerce partners using {ISV}."]

#### Business case

[Why now — revenue at risk, compliance deadline, partner demand, competitive pressure. Reference parent initiative when applicable.]

#### Product lifecycle phase

[General Availability | Beta | N/A]

#### Expected launch timeline

[Q{n} {year} — MM/DD/YYYY or "TBC following spike"]

---

## Goals and success

| Goal | What success looks like |
| --- | --- |
| [Goal 1] | [Measurable outcome] |
| [Goal 2] | [Measurable outcome] |

---

## User stories

**US-01 — [Short title]**
As a [persona], I want [action], so that [benefit].

---

## Acceptance criteria

### 1. [Theme]

* [Testable criterion]
* [Testable criterion]

---

## Dependencies and risks

| Dependency or risk | How we address it |
| --- | --- |
| [Item] | [Mitigation or owner] |

---

## Details

#### Customer type

[Commerce | Internal]

#### Use cases / Items included

1. [Capability or use case]
2. [Capability or use case]

#### Product dependencies

Product:

1. [Team/system — what is needed]

Non-Product:

1. [External API, vendor doc, etc.]

#### Out of scope

1. [Explicit exclusion and why]

#### Design requirements

Available in child stories, if any.

#### Engineering requirements

Available in child stories, if any.

#### Technical requirements

Available in child stories, if any.

#### QPS / QA expectations

[Zero defects on … | Error rate < X% | etc.]

#### Adoption plan

[Feature flag, pilot partner, GA rollout]

---

## Definition of done

* [Shippable outcome 1]
* [Shippable outcome 2]
* Release notes and partner-facing documentation updated.
```

### Platform template (stability, automation, Adobe-capabilities bucket)

Omit Goals/User stories/Acceptance criteria unless needed. Keep Summary + Details:

```markdown
## Summary

#### Scope

1. **[Workstream]:**
   1. [Item]
2. **[Workstream]:**
   1. [Item]

#### Impacted customers

Internal | [Named partners]

#### Business case

See parent initiative. | [One-line justification]

#### Product lifecycle phase

N/A | General Availability

#### Expected launch timeline

[Date or quarter end]

---

## Details

#### Customer type

Internal | Commerce

#### Use cases / Items included

Listed above

#### Product dependencies

N/A | [List]

#### Out of scope

[Explicit list or "N/A yet" only for early spikes — replace before increment planning]

#### QPS / QA expectations

Zero defects | [Specific quality bar]

#### Adoption plan

[How changes roll out]
```

## Quality checklist (before create)

- [ ] Summary follows a naming pattern above (not a codename alone)
- [ ] Problem and solution are distinct (problem = broken state; solution = what we build)
- [ ] Named customers or segment when demand-driven
- [ ] Out of scope has at least one item for non-trivial epics
- [ ] Delivery Quarter + label (`2026q2ac`) set
- [ ] Include on Roadmap? filled
- [ ] Parent Initiative linked when part of a portfolio bet
- [ ] No "Details - TBD" placeholders for epics entering increment planning

## Reference epics (2026 Q1–Q2, by created date)

Analyzed 2026-01-01 through 2026-06-30. See [examples.md](examples.md) for the list and links.

**Gold standard:** [AC-15137](https://appdirect.jira.com/browse/AC-15137) — full structure with goals, user stories, acceptance criteria, definition of done.

**Platform bucket:** [AC-15010](https://appdirect.jira.com/browse/AC-15010), [AC-15054](https://appdirect.jira.com/browse/AC-15054)

**Anti-pattern:** [AC-15011](https://appdirect.jira.com/browse/AC-15011) — "Details TBD"; do not replicate.

## JQL for recent AC epics

```jql
project = AC AND issuetype = Epic AND created >= 2026-01-01 AND created < 2027-01-01 ORDER BY created DESC
```

```jql
project = AC AND issuetype = Epic AND "Delivery Quarter" in (2026Q1, 2026Q2) ORDER BY created DESC
```
