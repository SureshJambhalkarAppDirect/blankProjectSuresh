# Epic: ConnectWise Integration for Marketplace Managers

**Epic Key:** [TBD – e.g. CW-MM-INTEGRATION]  
**Product Area:** Operations / Integrations (PSA)  
**Initiative:** Reseller Launch (MSP onboarding)  
**Status:** Draft  
**Priority:** High  
**Last Updated:** February 2026  

---

## 1. Executive Summary

ConnectWise integration is currently available for **Resellers** only. As part of the **Reseller Launch** initiative, the platform will onboard many **MSPs (Managed Service Providers)** who own their own marketplace. For these MSPs, the highest privileged role is **Marketplace Manager**. This EPIC extends **ConnectWise onboarding (credential configuration)** and **ConnectWise functionality (Company, Product, and Subscription Sync)** to **Marketplace Managers**, so that MSPs can configure and use ConnectWise from their marketplace without requiring Reseller-level access.

Configuration and management will be available in the same areas used today for Resellers: **Settings > INTEGRATION > PSA** for onboarding and credential configuration, and **Operations > EVENTS > ConnectWise** for sync management (Company, Product, Subscription Sync).

---

## 2. Background & Problem Context

Today, **ConnectWise integration** (onboarding, credential configuration, and sync of Company, Product, and Subscription data) is available only to **Resellers**. The platform navigation exposes ConnectWise under **Operations > EVENTS > ConnectWise** for management and under **Settings > INTEGRATION > PSA** for configuration.

Under the **Reseller Launch** initiative, the business will onboard many **MSPs** who operate their **own marketplace**. For these MSPs, the highest privileged role is **Marketplace Manager**—they do not have Reseller-level access. As a result:

- MSPs (as Marketplace Managers) cannot configure ConnectWise credentials or access ConnectWise onboarding for their marketplace.
- They cannot use ConnectWise functionality for **Company sync**, **Product sync**, or **Subscription sync** from their marketplace admin experience.
- Workarounds (e.g. elevating to Reseller or using a separate Reseller account) are not scalable and conflict with the goal of giving MSPs a dedicated marketplace experience.

To support Reseller Launch and MSP onboarding, ConnectWise **onboarding (credential configuration)** and **ConnectWise functionality (Company, Product, Subscription Sync)** must be available to users with the **Marketplace Manager** role, with configuration and management surfaced in the same areas where they appear for Resellers: **Settings > INTEGRATION > PSA** (config) and **Operations > EVENTS > ConnectWise** (management).

---

## 3. Scope of This EPIC

This EPIC is limited to making ConnectWise available to **Marketplace Managers** in their marketplace context:

| # | Capability | In scope |
|---|------------|----------|
| 1 | **ConnectWise onboarding (credential configuration)** | Marketplace Managers can complete ConnectWise onboarding and store credentials for their marketplace. Configuration is accessible where Resellers configure today: **Settings > INTEGRATION > PSA** (or equivalent placement for MM). |
| 2 | **ConnectWise management (Company, Product, Subscription Sync)** | Marketplace Managers can access and use ConnectWise Company sync, Product sync, and Subscription sync for their marketplace. Management is accessible where Resellers manage today: **Operations > EVENTS > ConnectWise**. |
| 3 | **Navigation and placement** | ConnectWise config and management are visible and actionable for the Marketplace Manager role in the same navigation locations as for Resellers (Settings > INTEGRATION > PSA for config; Operations > EVENTS > ConnectWise for management). |
| 4 | **RBAC** | Only users with Marketplace Manager (or equivalent highest-privilege) role for that marketplace can access ConnectWise onboarding and sync; behavior is consistent with existing ConnectWise security model. |

**Out of scope for this EPIC**

- Changes to ConnectWise integration logic itself (e.g. sync algorithms, API changes) unless required to support the Marketplace Manager role.
- New ConnectWise features beyond onboarding and Company/Product/Subscription Sync.
- Other PSA integrations (only ConnectWise is in scope).
- Reseller-specific ConnectWise behavior changes; Resellers continue to use ConnectWise as they do today.

---

## 4. Key Concepts (Summary)

- **Marketplace Manager (MM):** Highest privileged role for a marketplace owner (e.g. an MSP who owns their own marketplace). This role should have access to ConnectWise configuration and sync for that marketplace.
- **ConnectWise onboarding:** Process by which an admin configures ConnectWise credentials (and any required settings) so the marketplace can integrate with ConnectWise. Today this is available to Resellers; this EPIC extends it to Marketplace Managers.
- **ConnectWise functionality:** Company sync, Product sync, and Subscription sync between the marketplace and ConnectWise. Today available to Resellers; this EPIC extends it to Marketplace Managers.
- **Configuration placement:** **Settings > INTEGRATION > PSA** (or equivalent)—where credential configuration and onboarding are performed (as in the provided Settings screenshot).
- **Management placement:** **Operations > EVENTS > ConnectWise**—where sync management and ConnectWise operations are accessed (as in the provided Operations screenshot).

---

## 5. Solution Description

Extend the existing ConnectWise integration so that **Marketplace Managers** can:

1. **Configure ConnectWise (onboarding / credentials)**  
   Access the ConnectWise onboarding and credential configuration experience from their marketplace. This experience is presented in the same area where Resellers configure today: **Settings > INTEGRATION > PSA** (see screenshot: General Settings page, left sidebar **INTEGRATION > PSA**). Marketplace Managers see and can use the PSA/ConnectWise configuration entry for their marketplace.

2. **Use ConnectWise sync (Company, Product, Subscription)**  
   Access ConnectWise management and run or manage Company sync, Product sync, and Subscription sync for their marketplace. This is presented in the same area where Resellers manage today: **Operations > EVENTS > ConnectWise** (see screenshot: Users page, left sidebar **EVENTS > ConnectWise**). Marketplace Managers see and can use the ConnectWise link under EVENTS for their marketplace.

3. **Role-based access**  
   ConnectWise configuration and management are exposed only to users who have the Marketplace Manager (or equivalent) role for that marketplace. Existing RBAC and permission models are extended to include Marketplace Manager for these surfaces; no new roles are required unless otherwise defined by product.

4. **Consistency with Reseller experience**  
   The flows (onboarding, credential storage, sync triggers, and management UI) remain the same as for Resellers; only the set of roles that can access them is extended to include Marketplace Manager.

---

## 6. Impacted Customers

- **MSPs** who own their own marketplace and operate as **Marketplace Managers**.
- **Reseller Launch** initiative: all new MSP marketplaces onboarding in the initiative that require ConnectWise integration.

---

## 7. Business Case

Without this capability, MSPs onboarded under Reseller Launch cannot use ConnectWise from their marketplace. They would need Reseller-level access or a separate Reseller relationship to configure and use ConnectWise, which is not scalable and undermines the goal of giving MSPs a first-class marketplace experience. Enabling ConnectWise onboarding and Company/Product/Subscription Sync for Marketplace Managers removes that gap, supports Reseller Launch targets, and keeps configuration and management in the same places (Settings > INTEGRATION > PSA and Operations > EVENTS > ConnectWise) for consistency and discoverability.

---

## 8. Product Lifecycle Phase

General Availability (aligned with Reseller Launch / MSP onboarding).

---

## 9. Expected Launch Timeline

[TBD]

---

## 10. Details

**Customer type**  
Commerce (Reseller Launch / MSP marketplaces)

**Use cases / Items included**

- **ConnectWise onboarding for Marketplace Managers:** Marketplace Managers can complete ConnectWise credential configuration (onboarding) for their marketplace. Access point: **Settings > INTEGRATION > PSA** (or equivalent for MM), consistent with the placement shown in the Settings screenshot (INTEGRATION section, PSA).
- **ConnectWise management for Marketplace Managers:** Marketplace Managers can access ConnectWise Company sync, Product sync, and Subscription sync for their marketplace. Access point: **Operations > EVENTS > ConnectWise**, consistent with the placement shown in the Operations screenshot (EVENTS section, ConnectWise link).
- **Navigation:** ConnectWise config and management are visible in the left navigation for Marketplace Managers in the same locations as for Resellers (Settings > INTEGRATION > PSA; Operations > EVENTS > ConnectWise).
- **RBAC:** Only Marketplace Manager (or equivalent highest-privilege role for the marketplace) can access ConnectWise configuration and sync; unauthorized roles do not see or access these entries.
- **Documentation:** Update internal and partner-facing documentation to state that ConnectWise onboarding and sync are available to Marketplace Managers (in addition to Resellers) and to reference the navigation locations (Settings > INTEGRATION > PSA; Operations > EVENTS > ConnectWise).

**UI placement reference (from screenshots)**

- **Configuration / onboarding:** **Settings** (top nav) → left sidebar **INTEGRATION** → **PSA**. Marketplace Managers must have access to this section for ConnectWise credential configuration.
- **Management / sync:** **Operations** (top nav) → left sidebar **EVENTS** → **ConnectWise**. Marketplace Managers must have access to this link for Company, Product, and Subscription Sync.

**Product dependencies**

- **Product:** Existing ConnectWise integration (onboarding, credential storage, Company/Product/Subscription Sync), Settings (INTEGRATION > PSA), Operations (EVENTS > ConnectWise), RBAC/role model for marketplace.
- **Non-Product:** ConnectWise API and documentation; Reseller Launch rollout plan and MSP onboarding process.

**Out of scope**

- Changes to ConnectWise sync logic or APIs beyond what is needed to support Marketplace Manager access.
- Other PSA or integration types.
- Modifications to Reseller-only behavior unrelated to exposing the same flows to Marketplace Managers.

---

## 11. Functional Requirements

### 11.1 ConnectWise Onboarding (Credential Configuration) for Marketplace Managers

**Narrative**  
Marketplace Managers must be able to complete ConnectWise onboarding and configure credentials for their marketplace. The entry point is **Settings > INTEGRATION > PSA** (or equivalent). The flow and behavior match the existing Reseller ConnectWise onboarding experience.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CW-MM-1 | Marketplace Managers can access the ConnectWise onboarding / credential configuration experience for their marketplace. |
| CW-MM-2 | Access to ConnectWise configuration is available from **Settings > INTEGRATION > PSA** (or the same placement as for Resellers) when the user has the Marketplace Manager role. |
| CW-MM-3 | Marketplace Managers can save and update ConnectWise credentials for their marketplace; credentials are scoped to that marketplace. |
| CW-MM-4 | Users without Marketplace Manager (or equivalent) role for the marketplace do not see or access ConnectWise configuration in Settings. |
| CW-MM-5 | The onboarding flow and validation rules are the same as for Resellers; no functional regression for Resellers. |

---

### 11.2 ConnectWise Company, Product, and Subscription Sync for Marketplace Managers

**Narrative**  
Marketplace Managers must be able to access and use ConnectWise Company sync, Product sync, and Subscription sync for their marketplace. The entry point is **Operations > EVENTS > ConnectWise**. The behavior and data scope match the existing Reseller experience, scoped to the marketplace the user manages.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CW-MM-6 | Marketplace Managers can access the ConnectWise management experience (Company, Product, Subscription Sync) for their marketplace. |
| CW-MM-7 | Access to ConnectWise management is available from **Operations > EVENTS > ConnectWise** when the user has the Marketplace Manager role. |
| CW-MM-8 | Company sync, Product sync, and Subscription sync operate correctly when initiated by a Marketplace Manager; data is scoped to their marketplace. |
| CW-MM-9 | Users without Marketplace Manager (or equivalent) role do not see or access the ConnectWise link under EVENTS. |
| CW-MM-10 | Sync behavior and outcomes are consistent with Reseller-initiated sync; no functional regression for Resellers. |

---

### 11.3 Navigation and Visibility

**Narrative**  
ConnectWise configuration and management must be visible and reachable by Marketplace Managers in the same navigation locations used for Resellers, so that MSPs have a consistent and discoverable experience.

**Acceptance criteria**

| ID | Acceptance criterion |
|----|------------------------|
| CW-MM-11 | When a user has Marketplace Manager role for the current marketplace, **Settings > INTEGRATION > PSA** (or equivalent) is visible and navigable for ConnectWise configuration. |
| CW-MM-12 | When a user has Marketplace Manager role for the current marketplace, **Operations > EVENTS > ConnectWise** is visible and navigable for ConnectWise management. |
| CW-MM-13 | Navigation and labeling are consistent with the existing Reseller experience; no duplicate or conflicting entry points for ConnectWise. |

---

## 12. Success Criteria

- Marketplace Managers can complete **ConnectWise onboarding** (credential configuration) for their marketplace via **Settings > INTEGRATION > PSA**.
- Marketplace Managers can access and use **ConnectWise Company, Product, and Subscription Sync** via **Operations > EVENTS > ConnectWise**.
- Only users with Marketplace Manager (or equivalent) role can see and use these entry points for that marketplace.
- Reseller ConnectWise behavior and access remain unchanged; no regressions.
- Documentation reflects that ConnectWise is available to both Resellers and Marketplace Managers and references the correct navigation (Settings > INTEGRATION > PSA; Operations > EVENTS > ConnectWise).

---

## 13. Risks & Assumptions

**Risks**

- Role or permission model differences between Reseller and Marketplace Manager could require additional RBAC work beyond “expose same UI to MM.”
- Multi-marketplace or multi-tenant edge cases (e.g. user is MM for one marketplace and Reseller for another) may need explicit handling.

**Assumptions**

- The existing ConnectWise integration (APIs, credential storage, sync logic) can support being invoked in the context of a marketplace owned by an MSP (Marketplace Manager) without core logic changes, or with minimal scoping changes.
- “Marketplace Manager” is the correct role name and has a single, well-defined meaning for the marketplace; any equivalent highest-privilege role for MSP owners is treated the same for this EPIC.
- Reseller Launch and MSP onboarding timelines are aligned so that this capability is available when MSPs are onboarded.

---

## 14. Appendix — Placement Summary

| Area | Navigation path | Purpose |
|------|------------------|---------|
| **Configuration / Onboarding** | **Settings** → left sidebar **INTEGRATION** → **PSA** | ConnectWise credential configuration and onboarding for the marketplace. |
| **Management / Sync** | **Operations** → left sidebar **EVENTS** → **ConnectWise** | Company sync, Product sync, Subscription sync. |

*Placement is consistent with the provided screenshots (ConnectWise under EVENTS; PSA under INTEGRATION in Settings).*

---

*This EPIC extends ConnectWise integration to Marketplace Managers for the Reseller Launch initiative and does not change ConnectWise behavior for Resellers.*
