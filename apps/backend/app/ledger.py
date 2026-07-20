from __future__ import annotations

import os
import time
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Protocol
from uuid import uuid4

from app.core.config import Settings


@dataclass(frozen=True)
class LedgerReceipt:
    network: str
    transaction_id: str
    confirmed_at: datetime
    contract_address: str | None = None
    block_number: int | None = None


class LedgerPort(Protocol):
    def anchor(
        self,
        *,
        entity_type: str,
        entity_id: str,
        revision: int,
        root_hash: str,
        previous_root_hash: str | None,
    ) -> LedgerReceipt: ...


class DatabaseLedger:
    def __init__(self, network: str):
        self.network = network

    def anchor(
        self,
        *,
        entity_type: str,
        entity_id: str,
        revision: int,
        root_hash: str,
        previous_root_hash: str | None,
    ) -> LedgerReceipt:
        del entity_type, entity_id, revision, root_hash, previous_root_hash
        return LedgerReceipt(
            network=self.network,
            transaction_id=f"db:{uuid4()}",
            confirmed_at=datetime.now(UTC),
        )


class EvmLedger:
    """Minimal EVM adapter for the TraceAnchor contract described in the implementation docs."""

    ABI = [
        {
            "inputs": [
                {"internalType": "bytes32", "name": "entityKey", "type": "bytes32"},
                {"internalType": "uint256", "name": "revision", "type": "uint256"},
                {"internalType": "bytes32", "name": "rootHash", "type": "bytes32"},
                {"internalType": "bytes32", "name": "previousRootHash", "type": "bytes32"},
            ],
            "name": "anchor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
            "name": "latestAnchor",
            "outputs": [
                {"internalType": "uint256", "name": "revision", "type": "uint256"},
                {"internalType": "bytes32", "name": "rootHash", "type": "bytes32"},
            ],
            "stateMutability": "view",
            "type": "function",
        },
    ]

    def __init__(self, settings: Settings):
        self.settings = settings
        self.network = settings.ledger_network
        self.confirmations = settings.ledger_confirmations

    @staticmethod
    def _bytes32(value: str | None) -> bytes:
        if not value:
            return bytes(32)
        normalized = value.removeprefix("sha256:").removeprefix("0x")
        result = bytes.fromhex(normalized)
        if len(result) != 32:
            raise ValueError("Ledger root hash must contain exactly 32 bytes")
        return result

    def anchor(
        self,
        *,
        entity_type: str,
        entity_id: str,
        revision: int,
        root_hash: str,
        previous_root_hash: str | None,
    ) -> LedgerReceipt:
        try:
            from web3 import Web3
        except ImportError as exc:  # pragma: no cover - exercised only in EVM deployments
            raise RuntimeError("web3 is required when LEDGER_ADAPTER=evm") from exc
        web3 = Web3(Web3.HTTPProvider(self.settings.ledger_rpc_url, request_kwargs={"timeout": 20}))
        if not web3.is_connected():
            raise RuntimeError("LEDGER_RPC_URL is unavailable")
        contract_address = web3.to_checksum_address(self.settings.ledger_contract_address)
        contract = web3.eth.contract(address=contract_address, abi=self.ABI)
        key_ref = self.settings.ledger_signer_key_ref
        key = os.getenv(key_ref.removeprefix("env:"), "")
        if not key:
            raise RuntimeError("Ledger signer secret reference could not be resolved")
        account = web3.eth.account.from_key(key)
        entity_key = web3.keccak(text=f"{entity_type}:{entity_id}")
        existing_revision, existing_root = contract.functions.latestAnchor(entity_key).call()
        expected_root = self._bytes32(root_hash)
        if existing_revision == revision and existing_root == expected_root:
            return LedgerReceipt(
                network=self.network,
                transaction_id=f"evm:existing:{entity_key.hex()}:{revision}",
                confirmed_at=datetime.now(UTC),
                contract_address=contract_address,
            )
        if existing_revision >= revision:
            raise RuntimeError("EVM anchor revision already exists with a different root")
        function = contract.functions.anchor(
            entity_key,
            revision,
            expected_root,
            self._bytes32(previous_root_hash),
        )
        transaction = function.build_transaction(
            {
                "from": account.address,
                "nonce": web3.eth.get_transaction_count(account.address, "pending"),
                "chainId": web3.eth.chain_id,
            }
        )
        signed = account.sign_transaction(transaction)
        tx_hash = web3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
        if receipt.status != 1:
            raise RuntimeError("Ledger anchor transaction reverted")
        if self.confirmations > 1:
            target = receipt.blockNumber + self.confirmations - 1
            deadline = time.monotonic() + 180
            while web3.eth.block_number < target:
                if time.monotonic() >= deadline:
                    raise TimeoutError("Timed out waiting for ledger confirmations")
                time.sleep(2)
        return LedgerReceipt(
            network=self.network,
            transaction_id=tx_hash.hex(),
            confirmed_at=datetime.now(UTC),
            contract_address=contract_address,
            block_number=receipt.blockNumber,
        )


def build_ledger(settings: Settings) -> LedgerPort:
    if settings.ledger_adapter == "database":
        return DatabaseLedger(settings.ledger_network)
    if settings.ledger_adapter == "evm":
        return EvmLedger(settings)
    raise RuntimeError("Fabric adapter requires the R4 partner governance gate")
