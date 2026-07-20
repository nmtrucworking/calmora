# Blockchain traceability operations

The trace API uses PostgreSQL as the operational source of truth. The ledger stores only canonical SHA-256 roots, entity keys, revisions, timestamps, and transaction receipts. Do not send customer data, scan metadata, documents, or secret codes on-chain.

## Safe default

Use the database adapter while validating trace data and physical label operations:

```env
LEDGER_ADAPTER=database
LEDGER_NETWORK=database-local
TRACE_SECRET_PEPPER=<at-least-32-random-characters>
```

Approving or recalling a batch creates an outbox command. Unit activation creates its own outbox command. The database adapter confirms these commands immediately and exposes proof through `GET /api/v1/trace/units/{publicCode}/proof`.

## EVM testnet

Deploy `contracts/TraceAnchor.sol`, grant the backend signer the anchor role, and configure:

```env
LEDGER_ADAPTER=evm
LEDGER_NETWORK=<network-name>
LEDGER_RPC_URL=<https-rpc-url>
LEDGER_CONTRACT_ADDRESS=<deployed-contract-address>
LEDGER_SIGNER_KEY_REF=env:SENOVA_LEDGER_SIGNER_KEY
LEDGER_CONFIRMATIONS=2
```

The referenced environment variable must be injected by the deployment secret manager. Never commit it or expose it to the frontend.

Run the outbox worker as a separate process:

```text
python -m app.ledger_worker
```

For a scheduled one-shot job:

```text
python -m app.ledger_worker --once
```

Failures use the documented 1m, 5m, 15m, 1h, and 6h retry intervals. Trace and activation remain available during a chain outage. Inspect anchors through `GET /api/v1/admin/trace/anchors`; a failed outbox job can be released with `POST /api/v1/admin/trace/outbox/{jobId}/retry` after correcting the cause.

## Release gate

Do not make a public blockchain authenticity claim until deterministic hash vectors, activation race tests, receipt reconciliation, wrong-network checks, signer rotation, physical code reconciliation, and incident ownership have passed. A matching anchor proves that the recorded bundle has not changed; it does not prove that a physical product or source declaration is truthful.
