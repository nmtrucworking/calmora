# PostgreSQL backup and restore runbook

## Policy

- Production: encrypted managed backup daily, retain at least 14 days; enable PITR where the provider supports it.
- Staging: daily backup, retain at least 7 days.
- Access to backup artifacts and restore credentials follows least privilege and is audited by the provider.
- Target baseline: RPO 24 hours without PITR, RPO 15 minutes with PITR; RTO 4 hours. Product/operations must approve tighter targets.
- A backup is not considered valid until a restore and record-count reconciliation succeeds.

## Logical backup

```powershell
pg_dump --dbname $env:DATABASE_URL --format custom --file senova.dump
```

Store the dump outside the application host in encrypted storage. Never commit it or print the connection URL.

## Restore drill

Use a dedicated database whose name ends in `_restore_test`:

```powershell
createdb --host localhost --username postgres senova_restore_test
pg_restore --host localhost --username postgres --dbname senova_restore_test --exit-on-error senova.dump
```

Reconcile at minimum:

- Alembic revision equals the source revision;
- counts for `products`, `product_variants`, `qr_records`, QR content/overrides, `submissions`, and `analytics_events`;
- one catalog read, one QR resolve, and a submission idempotency smoke test;
- no application process points to the restore database.

## Evidence

The first M1 drill ran on 2026-07-16 against PostgreSQL 16 using an isolated local cluster. A custom-format 20,981-byte dump restored with `--exit-on-error`; source and restored reconciliation matched: products `3`, QR records `6`, submissions `3`, analytics events `0`.

Repeat this drill after material schema changes and at least quarterly in production operations. Record date, source revision, backup identifier, duration, reconciliation, operator, and follow-up actions without recording credentials or PII.
