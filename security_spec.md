# Firebase Security Rules Specification

## Data Invariants
1. A User explicitly links to a `users` document using `request.auth.uid`. Field updates are strictly governed.
2. Fleet Nodes (Agrobots) must belong to a specific steward ID. Types must be valid strings.
3. Vendor Products must declare price and supplier ESIN.
4. Ledgers (AgroBlock) are immutable strings.
5. Signals can only be created by the system or valid stewards.

## The Dirty Dozen Payloads
1. User creates profile for different UID.
2. User edits immutable field `uid` or `esin`.
3. User pushes malformed string over 1000 chars for `name`.
4. Fleet node registers with unknown `status`.
5. User updates fleet node they do not own.
6. A ledger block is modified after creation.
7. Signal is created without `priority`.
8. User modifies another user's profile.
9. Array size for connected nodes exceeds 100.
10. System paths are accessed by a non-system user.
11. User deletes a ledger block.
12. Vendor product has negative price.

## Enforcement Strategy
- Uses strict key checks with `hasOnly` for updates.
- Uses strict value formatting.
- Default deny.
