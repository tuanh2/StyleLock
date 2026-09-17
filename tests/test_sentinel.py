import pytest
import json

def test_sentinel_contract_structure():
    """Basic sanity check for contract syntax and dependencies."""
    with open("contracts/SentinelGuard.py", "r", encoding="utf-8") as f:
        content = f.read()

    # Rule 1 Check
    assert content.startswith('# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }')
    assert "from genlayer import *" in content
    assert "class Contract(gl.Contract):" in content
    assert "gl.vm.run_nondet" in content
    assert "SCAM_CONFIRMED" in content
    assert "PAUSE_TARGET" in content
