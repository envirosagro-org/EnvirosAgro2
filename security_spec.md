# Security Specification for Firestore

## 1. Data Invariants
- **Identity Integrity:** Every document linked to a user (`stewardId`, `customerEsin`, `supplierEsin`, `farmId`) must strictly match the `request.auth.uid`.
- **Ledger Immutability:** Records in `blocks` and `transactions` must never be updated or deleted after creation.
- **Role-Based Access:** Administrative fields (e.g., in `stewards` or `projects`) cannot be modified by the user directly unless verified by admin role (if applicable).
- **Referential Integrity:** Relationships (e.g., `contractId` in `orders`) must verify existence if required by operational logic.
- **Schema Enforcement:** All writes must conform to the defined Firestore Schema.

## 2. Relationship Mapping
- **Tasks / Telemetry:** Belong to `MachineNode` or `Steward`. Access derived by ownership of the parent resource.
- **MRV Jobs:** Associated with an `AssetId`.
- **WebRTC Calls / Broadcasts:** Session-based; participants are validated via `stewardId` or hosted by the creator.
- **AR Anchors:** Registered against `stewardId`.
- **Sensor Readings (DroneTelemetry):** Logged against `droneId` (linked to `MachineNode`).

## 3. The "Dirty Dozen" Payloads (Examples)
1. **Unverfied User Write:** Attempt `create` on `stewards` with `email_verified: false`.
2. **Identity Spoofing:** User A attempts to `create` or `update` a `steward` document for User B (different UID).
3. **Ledger Tampering:** Attempt to `update` a document in `blocks`.
4. **Invalid Schema (Shadow Field):** Attempt to `create` a `project` with extra forbidden fields.
5. **Resource Poisoning (ID):** Attempt to `create` a `steward` doc with an ID > 128 chars.
6. **State Shortcutting:** Attempt to `update` an `order` status to 'completed' without fulfilling `contract` requirements.
7. **Type Poisoning:** Attempt to `create` a `transaction` with a string value for the `value` field (should be number).
8. **PII Isolation Leak:** Authenticated User B attempts to `get` User A's private PII details (if stored in a non-split collection).
9. **Query Scraping:** Attempt a `list` query on `transactions` without the required `farmId` filter in the rule.
10. **Orphaned Record:** Attempt to `create` a `contract` without a corresponding `projectId`.
11. **Timestamp Forgery:** Attempt to `create` a telemetry reading with a past `createdAt` timestamp.
12. **Immutable Field Write:** Attempt to `update` `createdAt` field in a project.

## 4. Test Runner (Draft Plan)
A `firestore.rules.test.ts` will be created to unit test these scenarios using the Firebase Emulator.
