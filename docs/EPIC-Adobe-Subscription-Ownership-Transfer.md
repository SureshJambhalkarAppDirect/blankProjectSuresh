# Epic: Adobe Admin Sync on Subscription_Change (Take Ownership)

**Epic Key:** [TBD – e.g. MP-ADOBE-OWNERSHIP]  
**Source PRD:** [PRD-Adobe-Subscription-Ownership-Transfer.md](./PRD-Adobe-Subscription-Ownership-Transfer.md)  
**Status:** Draft  
**Priority:** High  
**Last Updated:** February 10, 2026  

---

## Summary

When a user takes ownership of an existing Adobe subscription in the AppDirect marketplace (e.g., a departing user’s subscription is transferred to an admin), a new order is created and a Subscription_Change event is emitted. Today, the Adobe admin is not updated automatically, so the new owner cannot administer the subscription in Adobe and the previous owner may still hold admin rights. This epic delivers a platform solution to automatically create or replace the Adobe admin account whenever ownership is transferred, so that marketplace ownership is the source of truth and the new owner can manage the Adobe subscription without support or TC involvement.

---

## Problem description

The difference in the way subscription ownership is handled between Adobe and the AppDirect marketplace poses a challenge for our partners. In the marketplace, when an admin or another user “takes ownership” of an existing Adobe subscription (for example, when the current owner is leaving the organization), a new order is created and a Subscription_Change event is generated. The marketplace correctly reflects the new owner. Adobe, however, maintains its own notion of who is the admin for that organization’s Adobe products. Today, there is no automated process that aligns the two.

When ownership is transferred, the new subscription owner often does not have an Adobe admin account, or the previous owner remains the admin in Adobe. As a result, the new owner cannot perform admin tasks in Adobe (e.g., user management, policy configuration) and must contact support or TCs. The organization may also retain an Adobe admin account for a user who no longer has access to the marketplace, creating security and compliance concerns. Support and TCs are burdened with manual steps to create or replace the Adobe admin after each ownership change, and the process is inconsistent across Adobe products.

To address this, we require a solution on our platform that, upon a Subscription_Change event for an Adobe product subscription, automatically creates an Adobe admin for the new owner when none exists, or replaces the existing Adobe admin with the new owner. Considerations include Adobe’s supported APIs for admin create/replace (e.g., Admin Console, UMAPI), identity mapping between marketplace users and Adobe identities, idempotent processing of events, and applicability across all Adobe products in the marketplace.

---

## Solution description

Enhance the platform to consume Subscription_Change events for Adobe product subscriptions and automatically create or replace the Adobe admin so the new subscription owner becomes the admin in Adobe. The solution will include:

- **Event consumption:** Consume Subscription_Change events from the marketplace (event bus/webhook), parse the payload, and filter for Adobe product subscriptions only. Resolve the new subscription owner from the event or linked order (user ID, email, account context).

- **Product identification:** Introduce a mechanism to recognize Adobe products and validate that the subscription is eligible for admin create/replace. Use product/SKU from the event or order to determine the correct Adobe product and tenant context.

- **Adobe admin create:** When the new owner has no existing Adobe admin for that subscription/account, call Adobe APIs to create an admin for the new owner. Map marketplace user identity to Adobe identity (e.g., Adobe ID, enterprise ID) per Adobe’s model.

- **Adobe admin replace:** When an Adobe admin already exists for that subscription/account, replace that admin with the new owner using Adobe’s supported replace/de-provision flow so the previous owner no longer holds admin rights.

- **Idempotency & observability:** Process events idempotently (e.g., event ID or idempotency key) so duplicate or retried events do not create duplicate admins. Log all outcomes (success and failure) with event ID, subscription, new owner, and error details; provide metrics and optional alerting/retry for failures.

- **Validation & testing:** Thoroughly test the feature so that admin create/replace is correctly applied for Adobe products without impacting non-Adobe products or non–Subscription_Change flows.

- **Documentation update:** Create/update relevant internal and external documentation (runbooks, event contract, Adobe integration, troubleshooting).

Only the use cases described in the PRD and in the “Use cases/Items included” section below are supported. All other scenarios (e.g., non-Adobe products, bulk historical backfill, multiple admins per subscription) are out of scope due to platform scope decisions.

---

## Impacted customers

ACP, Cancom, Softchoice, and all commerce partners offering Adobe products where subscription ownership transfer (take ownership) is used.

---

## Business case

The absence of this capability prevents new subscription owners from self-serving: they cannot administer their Adobe subscription without support or TC involvement. Partners have repeatedly raised this issue, seeking a resolution to avoid manual processes that involve support and TCs and incur additional cost. Implementing automatic Adobe admin create/replace on Subscription_Change will improve the user experience, eliminate support and TC involvement for this flow, reduce security and compliance risk from orphaned admins, and support the successful operation of reseller stores.

---

## Product lifecycle phase

General Availability

---

## Expected launch timeline

[TBD]

---

## Details

**Customer type**  
Commerce

**Use cases / Items included**

- Ability for the new subscription owner to automatically receive Adobe admin (create or replace) when ownership is transferred via Subscription_Change in the marketplace, for all in-scope Adobe products.
- Support for both “create admin when no admin exists” and “replace existing admin with new owner” flows, with idempotent processing and observable failures (logging, optional alerting/retry).
- Configuration or feature flag to enable/disable or roll out the behavior by product or tenant (optional).
- Documentation (add new and update as required), both internal and external:
  - How-to / runbook: Adobe admin sync on Subscription_Change (take ownership).
  - Event contract and integration notes (Subscription_Change, order, new owner resolution).
  - Adobe integration (Admin Console / UMAPI) and identity mapping.
  - Troubleshooting guide (e.g., failed create/replace, identity mismatch, Adobe API errors).
  - Update AppConnector and playbook documentation as needed (e.g., Adobe AppConnector Playbook, Tech Design).
- Tech design and validation aligned with [PRD-Adobe-Subscription-Ownership-Transfer.md](./PRD-Adobe-Subscription-Ownership-Transfer.md).

**Product dependencies**

- **Product:** Subscription, Order, Events (Subscription_Change)
- **Non-Product:** TD for language and documentation; Adobe API documentation and access (Admin Console / UMAPI or equivalent)

**Out of scope**

- Non-Adobe products
- Bulk historical backfill of admins for past ownership changes
- Multiple admins per subscription
- API (for headless) unless explicitly added in a separate initiative
- Changing Adobe product features or roles (defined by Adobe)

**Design requirements**  
Available in the stories, if any.

**Engineering requirements**  
Available in the stories, if any.

**Technical requirements**  
Available in the stories, if any.

**QPS expectations**  
Zero defects; event-to-admin-update within agreed SLA; idempotent behavior under retries and duplicate events.

**Adoption plan**  
All changes will be available to all partners. No partner-specific feature flags required for core behavior; optional configuration may allow rollout by product or tenant.

---

## Child user stories (summary)

Stories are defined in the sections below with user story format and acceptance criteria. These can be created as child issues of this Epic in the backlog.

---

### Story 1: Consume Subscription_Change for Adobe and resolve new owner

**User story:** As a backend system, I want to consume Subscription_Change events from the marketplace and identify the new subscription owner for Adobe products, so that we can trigger Adobe admin create/replace for the correct user.

**Acceptance criteria:** Subscription_Change events consumed from event source; payload parsed (subscription ID, product/SKU); only Adobe subscriptions processed; new owner resolved from event/order; identity passed to create/replace flow; processing is idempotent.

---

### Story 2: Create Adobe admin when no admin exists

**User story:** As an organization admin who has taken ownership of an Adobe subscription in the marketplace, I want the system to create an Adobe admin account for me automatically when there is no existing admin, so that I can manage the Adobe subscription without contacting support.

**Acceptance criteria:** When no existing Adobe admin, system calls Adobe APIs to create admin for new owner; marketplace identity mapped to Adobe identity; new owner verifiable as admin in Adobe; failures logged with context; optional retry/alert.

---

### Story 3: Replace existing Adobe admin with new owner

**User story:** As an organization admin who has taken ownership of an Adobe subscription from a departing user, I want the previous owner’s Adobe admin to be replaced with me, so that I am the only admin and the leaver no longer has admin access.

**Acceptance criteria:** When Adobe admin exists, system replaces with new owner using Adobe’s supported flow; previous owner no longer admin; new owner verifiable as admin; failures logged; optional retry/alert.

---

### Story 4: Apply admin create/replace to all Adobe products in marketplace

**User story:** As a company administrator, I want the same create/replace admin behavior for all Adobe products in the marketplace, so that I don’t have to follow product-specific processes.

**Acceptance criteria:** Flow applies to all Adobe products in scope; product/SKU used for Adobe product and tenant context; no in-scope product excluded unless configured.

---

### Story 5: Idempotent handling of Subscription_Change

**User story:** As the system, I want Subscription_Change processing to be idempotent, so that duplicate or retried events do not create duplicate admins or inconsistent state.

**Acceptance criteria:** Idempotency key used; re-processing same event does not create second admin or inconsistent state; outcome deterministic for same key.

---

### Story 6: Logging, metrics, and optional alerting for Adobe admin create/replace

**User story:** As an operations or support engineer, I want failures in creating or replacing the Adobe admin to be logged and visible (and optionally alerted), so that we can fix issues, retry, or escalate.

**Acceptance criteria:** All processed events logged (event ID, subscription, new owner, outcome, error if failed); metrics available (e.g., success rate, latency); optional alerting and retry policy.

---

### Story 7: Configuration or feature flag for Adobe admin sync (optional)

**User story:** As an operations or product owner, I want the ability to enable/disable or roll out this behavior by product or tenant, so that we can control rollout and disable if needed.

**Acceptance criteria:** Behavior enable/disable via config or feature flag; when disabled, Subscription_Change for Adobe not processed for admin create/replace; configuration documented.

---

## References

- **PRD:** [PRD-Adobe-Subscription-Ownership-Transfer.md](./PRD-Adobe-Subscription-Ownership-Transfer.md)
- AppDirect marketplace / order / event documentation (internal)
- Adobe AppConnector Playbook, Tech Design, and Adobe Admin Console / UMAPI documentation (as referenced in AppDirect wiki and partner docs)
