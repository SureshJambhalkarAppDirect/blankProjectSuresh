# JIRA Import Guide – Adobe Subscription Ownership Transfer Epic

Use this guide to import the Epic and Stories from the CSV file into JIRA (Cloud or Data Center / Server). The CSV is formatted for the **new JIRA UI** and standard CSV import.

---

## File to Import

- **File:** `JIRA-Import-Adobe-Subscription-Ownership-Transfer.csv`
- **Contents:** 1 Epic + 7 Stories, with Epic Link set so all Stories link to the Epic.

---

## Import Steps (JIRA Cloud – New UI)

1. **Open CSV import**
   - Go to **Jira Administration** (gear icon) → **System** → **External System Import**.
   - Or: **Project settings** → **Import** (if your instance exposes CSV import from the project).
   - Select **CSV** as the import source.

2. **Select project/space**
   - Choose the **project (or space)** where the Epic and Stories should be created.
   - Confirm the project has **Epic** and **Story** issue types (and any other types you use).

3. **Upload CSV**
   - Upload `JIRA-Import-Adobe-Subscription-Ownership-Transfer.csv`.

4. **Map CSV columns to JIRA fields**
   - Map the CSV columns to your JIRA fields as follows. Names may differ slightly (e.g. “Issue Type” vs “Issue type”); pick the matching field.

   | CSV column   | Map to JIRA field | Notes |
   |--------------|-------------------|--------|
   | Issue Type   | Issue type       | Must exist: Epic, Story. |
   | Summary      | Summary          | Required. |
   | Description  | Description      | Plain text. |
   | Priority     | Priority         | Values in CSV: High, Medium. |
   | Labels       | Labels           | Optional; comma-separated in CSV. |
   | Epic Name    | Epic Name        | For Epic issue only; leave unmapped for Stories if not needed. |
   | Epic Link    | Epic Link        | For Stories only; link to Epic by name. |

   - **Epic Link:** Map “Epic Link” to your project’s **Epic Link** (or “Parent” if your hierarchy uses Parent for Epics). The CSV uses the Epic name **“Adobe Admin Sync on Subscription_Change”** so that Stories link to the Epic created in the same import.
   - **Epic Name:** Map “Epic Name” to **Epic Name** for the Epic row. Use the same value as in the Epic Link column (“Adobe Admin Sync on Subscription_Change”) so the link works.

5. **Validation**
   - Run validation. Fix any errors (e.g. issue type or priority not found; create them in the project first or adjust the CSV).
   - Ensure **Epic** and **Story** exist in the project and that **Epic Link** (or Parent) is available for Stories.

6. **Run import**
   - Start the import. When it finishes, check the migration report for failed or skipped rows.

7. **Verify**
   - Open the project backlog/board and confirm:
     - One **Epic**: “Adobe Admin Sync on Subscription_Change (Take Ownership)”.
     - Seven **Stories** under that Epic (Epic Link or Parent set correctly).

---

## If Your JIRA Uses “Parent” Instead of “Epic Link”

- Import the **Epic** first (e.g. import only the first data row as a test, or use a two-step process).
- Then import the **Stories** and map the column that contains “Adobe Admin Sync on Subscription_Change” to **Parent**, and ensure the Epic’s name or key is used for linking (depending on how your JIRA matches parents).

Alternatively, keep the Epic and all Stories in one CSV and map:
- **Epic Link** → **Parent** (if your JIRA accepts Epic name for Parent), or  
- Use the same column for **Epic Link** if your project uses Epic Link for Stories.

---

## CSV Column Summary

| Column       | Used for   | Example value |
|-------------|------------|-------------------------------|
| Issue Type  | All        | Epic, Story                  |
| Summary     | All        | Title of Epic or Story       |
| Description | All        | Plain-text body + acceptance criteria |
| Priority    | All        | High, Medium                 |
| Labels      | All        | marketplace, adobe, integration |
| Epic Name   | Epic only  | Adobe Admin Sync on Subscription_Change |
| Epic Link   | Stories    | Adobe Admin Sync on Subscription_Change |

---

## Troubleshooting

- **“Issue type not found”:** Add **Epic** and **Story** to the project’s issue type scheme, then re-import.
- **“Epic Link / Parent not linking”:** Confirm Epic Name on the Epic matches the value in the Epic Link column exactly (e.g. “Adobe Admin Sync on Subscription_Change”). Some JIRA versions link by Epic Name, others by Key (after Epic is created).
- **“Invalid priority”:** Ensure **High** and **Medium** exist in the project. Edit the CSV to use your project’s priority names if needed.
- **Multiline description issues:** The CSV uses quoted multiline Description fields. If your tool breaks on newlines, open the CSV in Excel, save as CSV again, or use a script to replace newlines inside Description with a placeholder (e.g. “ | “) and replace back in JIRA after import.

---

## After Import

- Attach or link the **PRD** and **Epic markdown** to the Epic for reference.
- Set **status**, **assignee**, **sprint**, and **story points** as per your process.
- Add any **custom fields** (e.g. Theme = “Marketplace – Adobe”) via JIRA UI.
