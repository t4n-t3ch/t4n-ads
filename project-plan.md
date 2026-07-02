# Edit Plan

1. AUDIT_REPORT.md — NEW: Create a comprehensive audit document scanning src/ for hook/return destructuring mismatches, missing interface fields, invalid props, broken imports, and incomplete/truncated files, formatted as itemized findings per the required issue template.

2. src/types/index.ts — EDIT: Consolidate and document all shared TypeScript interfaces (e.g., Ad, User, Listing, Category, Props types) referenced during the audit so mismatched fields identified in AUDIT_REPORT.md can be cross-referenced against a single canonical type source.

3. prisma/schema.prisma — EDIT: Review and annotate (via comments, not structural changes) the existing models against usages found in src/ to confirm which fields referenced in code are actually missing from the schema, supporting the "missing field" audit category.

4. src/lib/hooks/useAuth.ts — EDIT: Review the hook's actual return object shape versus how it is destructured across components (e.g., dashboard, navbar) to document any naming mismatches (e.g., `user` vs `currentUser`, `isLoading` vs `loading`) for inclusion in AUDIT_REPORT.md.