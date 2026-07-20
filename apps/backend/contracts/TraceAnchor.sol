// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Senova Trace Anchor
/// @notice Stores hashes only. Product, customer, and trace payload data remain off-chain.
contract TraceAnchor {
    struct AnchorState {
        uint256 revision;
        bytes32 rootHash;
    }

    address public owner;
    bool public paused;
    mapping(address => bool) public anchorers;
    mapping(bytes32 => AnchorState) public latestAnchor;

    event TraceAnchored(
        bytes32 indexed entityKey,
        uint256 revision,
        bytes32 rootHash,
        bytes32 previousRootHash,
        uint256 anchoredAt
    );
    event AnchorRoleChanged(address indexed account, bool enabled);
    event PauseChanged(bool paused);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner only");
        _;
    }

    modifier onlyAnchorer() {
        require(anchorers[msg.sender], "anchor role required");
        _;
    }

    constructor(address initialAnchorer) {
        require(initialAnchorer != address(0), "invalid anchorer");
        owner = msg.sender;
        anchorers[initialAnchorer] = true;
        emit AnchorRoleChanged(initialAnchorer, true);
    }

    function setAnchorer(address account, bool enabled) external onlyOwner {
        require(account != address(0), "invalid account");
        anchorers[account] = enabled;
        emit AnchorRoleChanged(account, enabled);
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit PauseChanged(nextPaused);
    }

    function anchor(
        bytes32 entityKey,
        uint256 revision,
        bytes32 rootHash,
        bytes32 previousRootHash
    ) external onlyAnchorer {
        require(!paused, "anchoring paused");
        require(rootHash != bytes32(0), "empty root hash");
        AnchorState memory previous = latestAnchor[entityKey];
        require(revision > previous.revision, "revision must increase");
        require(previous.rootHash == previousRootHash, "previous root mismatch");
        latestAnchor[entityKey] = AnchorState(revision, rootHash);
        emit TraceAnchored(entityKey, revision, rootHash, previousRootHash, block.timestamp);
    }
}
