# Epic: Cost-based Pricing — Product Uploader Workflows

**Epic Key:** [TBD – e.g. CBP-PRODUCT-UPLOADER]  
**Parent EPIC:** Cost-based Pricing (Catalog, API, RBAC)  
**Product Area:** Pricing / Product Uploader  
**Status:** Draft  
**Priority:** High  
**Last Updated:** February 2026  

---

## 1. Executive Summary

This EPIC delivers **Cost-based Pricing (CBP)** support within **Product Uploader** only. Product Uploader uses **CSV upload** for creating and updating products and pricing. This EPIC introduces **cost** as a first-class concept in the CSV-based workflows—Create Product, Update Pricing Plans, Update Edition pricing, and Update Marketplace Pricing—so that publishers and operators can define and maintain catalog cost alongside MSRP in the same CSV files they use today.

The CSV format will support **cost column(s)** (with cost conceptually before or alongside MSRP columns in the schema), structural validation on upload (e.g. MSRP not below cost), and RBAC so only authorized roles can upload or access CSV data containing cost. The work relies on the foundational catalog model, GraphQL, and RBAC defined in the parent Cost-based Pricing EPIC and does not implement guardrails, promotions logic, or snapshot persistence.

---

## 2. Background & Problem Context

AppDirect’s MSRP-down pricing model does not expose **cost** in catalog authoring tools. Product Uploader is the primary mechanism for creating and updating products, editions, and pricing plans **via CSV upload**. Without cost in the CSV:

- Publishers and operators cannot set or maintain cost when creating products or updating pricing through the CSV.
- Cost must be managed outside Product Uploader or not at all, leading to inconsistent data and blocking downstream cost-first use cases (margin, guardrails, reporting).

The parent Cost-based Pricing EPIC establishes cost in the catalog data model, GraphQL, and RBAC. This EPIC scopes that work to **Product Uploader only** (CSV-based flows), so the same cost capabilities are available in the CSV format and upload processing that users already use.

---

## 3. Scope of This EPIC (Product Uploader Only)

This EPIC is limited to making cost available and governable **within Product Uploader** across these workflows:

| # | Workflow | In scope |
|---|----------|----------|
| 1 | **Create Product** | Cost column(s) in CSV at edition and pricing plan level; cost alongside/before MSRP columns; validation on upload and RBAC. |
| 2 | **Update Pricing Plans** | Cost column(s) in CSV for all plan types (flat, recurring, usage-based, setup fee, tiered, hybrid); validation on upload. |
| 3 | **Update Edition pricing** | Edition-level and per–pricing plan cost column(s) in CSV; clear column names (e.g. Cost, MSRP); validation on upload. |
| 4 | **Update Marketplace Pricing** | Cost column(s) in the CSV used for marketplace pricing upload; same validation and RBAC. |

**Out of scope for this EPIC**

- Cost in non–Product Uploader surfaces (e.g. standalone edition UI or other non-CSV flows) unless they are part of the Product Uploader CSV flow.
- Cost-based guardrails, discount rules, or transaction-time validations (owned by Commerce Flow / Discounts).
- Snapshot implementation, connector cost override logic, promotions, invoicing/reporting cost visibility, migration/backfill, and network/syndicated product cost (all defined in parent or other EPICs).

---

## 4. Key Concepts (Summary)

- **Catalog cost:** Cost defined in the catalog for an edition or pricing plan; baseline for effective cost unless overridden (e.g. by connector) later.
- **Cost vs MSRP:** Cost is the foundational input; MSRP is the list price. In the **CSV format**, cost column(s) are defined alongside MSRP column(s) (e.g. cost column(s) before or next to MSRP for clarity); the CSV schema/template must use clear column names (e.g. Cost, MSRP).
- **Structural validation:** On CSV upload/processing, MSRP must not be less than cost where both are provided. This is a data-correctness rule, not a commercial guardrail.
- **RBAC:** Only roles with permission to view/edit pricing (and cost, per parent EPIC) can upload CSV containing cost or access CSV template/export that includes cost columns.
- **Backward compatibility:** CSV uploads without cost columns continue to work; cost columns are optional and can be rolled out behind a feature flag.

---

## 5. Functional Requirements by Workflow

### 5.1 Create Product

**Narrative**  
When a user creates a new product (and its edition and pricing plans) via **CSV upload** in Product Uploader, the CSV must support **cost** column(s) for the edition and for each pricing plan. Cost column(s) must be defined in the CSV schema alongside MSRP/list price columns (e.g. cost before or next to MSRP) and support all pricing types (flat, recurring, usage-based, setup fee, tiered, hybrid). CSV upload/processing must validate that MSRP is not below cost where both are provided.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CBP-PU-1 | The Create Product CSV supports cost column(s) at edition level. |
| CBP-PU-2 | The Create Product CSV supports cost column(s) for each pricing plan (all supported plan types). |
| CBP-PU-3 | The CSV schema/template uses clear column names for cost and MSRP (e.g. “Cost”, “MSRP” or equivalent list price). |
| CBP-PU-4 | Create Product CSV upload fails validation when MSRP &lt; cost for any plan where both are provided. |
| CBP-PU-5 | Cost column(s) respect currency and locale formatting used in Product Uploader CSV. |
| CBP-PU-6 | Cost column(s) are optional; products can be created via CSV without cost (backward compatibility). |
| CBP-PU-7 | Only roles with cost view/edit permission can upload CSV containing cost or access template/export with cost (RBAC). |

---

### 5.2 Update Pricing Plans

**Narrative**  
When a user updates pricing plans for an existing product via **CSV upload** in Product Uploader, the CSV must support **cost** column(s) for each plan. Cost must be supported for flat, recurring, usage-based, setup fee, tiered, and hybrid plans. The CSV format includes cost column(s) alongside MSRP; upload/processing validates and rejects rows where MSRP &lt; cost.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CBP-PU-8 | The Update Pricing Plans CSV supports cost column(s) for every pricing plan type. |
| CBP-PU-9 | The CSV schema includes cost column(s) alongside MSRP for every pricing plan type. |
| CBP-PU-10 | Update Pricing Plans CSV upload fails validation when, for any plan, MSRP &lt; cost (where both are set). |
| CBP-PU-11 | Cost and MSRP columns use consistent currency/locale and validation rules. |
| CBP-PU-12 | CSV without cost columns continues to work; cost remains optional. |
| CBP-PU-13 | Upload or access to CSV containing cost for Update Pricing Plans follows RBAC. |

---

### 5.3 Update Edition Pricing

**Narrative**  
When a user updates edition-level pricing via **CSV upload** in Product Uploader, the CSV must support **cost** column(s) at the edition level and per–pricing plan. Column names (e.g. Cost, MSRP) and schema (cost alongside MSRP) must be consistent with Create Product and Update Pricing Plans. The same structural validation applies on upload.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CBP-PU-14 | The Update Edition pricing CSV supports edition-level cost column(s). |
| CBP-PU-15 | The CSV schema uses clear cost and MSRP column names and supports cost at edition and plan level. |
| CBP-PU-16 | Edition pricing CSV upload fails validation when MSRP &lt; cost where both are provided. |
| CBP-PU-17 | Cost at edition level and at plan level are both supported in the CSV and consistent with catalog model. |
| CBP-PU-18 | CSV rows without cost columns are accepted; editions without cost continue to process without error. |
| CBP-PU-19 | RBAC applies to uploading or accessing CSV containing cost for Update Edition pricing. |

---

### 5.4 Update Marketplace Pricing

**Narrative**  
Where Product Uploader supports **Update Marketplace Pricing** via **CSV upload**, the CSV must support **cost** column(s) with the same rules: cost alongside MSRP in schema, structural validation on upload, RBAC. This applies only to the Product Uploader CSV used for marketplace pricing, not to other marketplace-level cost governance or overrides (those are out of scope).

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CBP-PU-20 | The CSV used for Update Marketplace Pricing in Product Uploader supports cost column(s); only authorized roles can upload or access it. |
| CBP-PU-21 | Cost vs MSRP column structure and validation (MSRP not below cost) apply when uploading marketplace pricing CSV. |
| CBP-PU-22 | RBAC for cost is consistent with other Product Uploader CSV workflows. |
| CBP-PU-23 | This EPIC does not add new marketplace-level cost policies or governance toggles. |

---

## 6. Cross-Cutting Requirements

### 6.1 CSV format and validation

- **CSV schema and template:** The CSV format (column names, order, and semantics) for cost must be documented; cost column(s) should be defined alongside MSRP (e.g. cost before or next to MSRP columns) for clarity. The [cost-based pricing prototype](https://arunrohal-ad.vercel.app/billing/pricing/cost-based-pricing/) may be used as conceptual reference for the relationship between cost and MSRP; the actual implementation is CSV-based.
- **Documentation:** CSV template and/or documentation must describe cost column(s) (e.g. “Cost is used for margin calculation”) so uploaders understand how to populate them.
- **No guardrails in this EPIC:** “Price cannot go below cost” at transaction time, discount rules, and marketplace-level enforcement are out of scope.

### 6.2 RBAC

- Upload and access to CSV containing cost in Product Uploader follow the same RBAC model as in the parent EPIC (e.g. only roles with permission to change pricing plan / cost can upload CSV with cost or access template/export that includes cost).
- Unauthorized users must not be able to upload CSV with cost or receive CSV export/template that includes cost; errors must not expose cost values.

### 6.3 Backward compatibility and feature flag

- Existing CSV uploads without cost columns continue to work in Product Uploader without change.
- Cost column support in Product Uploader CSV can be gated by a feature flag until broader adoption; when disabled, cost columns may be ignored or omitted from template/export per product/marketplace configuration defined elsewhere.

---

## 7. Dependencies

- **Parent Cost-based Pricing EPIC:** Catalog data model (cost at edition and pricing plan), GraphQL read/write for cost, RBAC for cost, and conceptual cost-precedence/snapshot design must be available or aligned so Product Uploader can consume and persist cost correctly.
- **Product Uploader:** Existing Create Product, Update Pricing Plans, Update Edition pricing, and Update Marketplace Pricing CSV flows and their APIs/integrations.
- **CSV format and documentation:** Agreed CSV schema/template for cost column(s), column names, and validation error messaging for upload.

---

## 8. Out of Scope (Explicit)

- Cost in surfaces that are not part of Product Uploader (e.g. standalone edition UI or other non-CSV flows).
- Cost-based discount/price guardrails, commerce-flow validations, or promotion logic.
- Snapshot implementation, connector cost override implementation, invoice/reporting cost visibility.
- Price Book cost overrides, operator-level cost adjustments, marketplace-level cost governance toggles.
- Migration, backfill, or SOPs for existing products.
- Network/syndicated product cost handling.

---

## 9. Success Criteria

- Publishers and operators can **create products** with cost at edition and pricing plan level via CSV upload in Product Uploader.
- Publishers and operators can **update pricing plans** and **edition pricing** with cost via CSV, with cost column(s) alongside MSRP and validation on upload (MSRP not below cost).
- **Update Marketplace Pricing** CSV (within Product Uploader) supports cost column(s) with the same validation and RBAC.
- Existing Product Uploader CSV flows without cost columns continue to work; no regressions.
- Upload and access to CSV containing cost in Product Uploader are fully gated by RBAC.

---

## 10. Risks & Assumptions

**Risks**

- Misalignment with parent EPIC (catalog/API/RBAC) could require rework in Product Uploader.
- Inconsistent cost entry (e.g. partial cost) may complicate downstream adoption; governance is outside this EPIC.

**Assumptions**

- Parent EPIC delivers catalog cost model, GraphQL for cost, and RBAC in time for Product Uploader to integrate.
- Product Uploader uses or will use the same APIs and permission model as the parent EPIC for cost.
- Feature flag and rollout strategy for CBP in Product Uploader are agreed with Product and Engineering.

---

## 11. Appendix — Workflow Summary

| Workflow | Cost at edition | Cost per plan | Validation (MSRP ≥ cost) | RBAC |
|----------|-----------------|----------------|---------------------------|------|
| Create Product | Yes | Yes (all types) | Yes | Yes |
| Update Pricing Plans | N/A | Yes | Yes | Yes |
| Update Edition pricing | Yes | Yes | Yes | Yes |
| Update Marketplace Pricing | As in flow | As in flow | Yes | Yes |

---

*This EPIC is a subset of the broader Cost-based Pricing initiative and is limited to Product Uploader workflows only.*
