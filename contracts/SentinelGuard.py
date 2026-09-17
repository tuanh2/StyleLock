# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass
import json

@allow_storage
@dataclass
class SecurityReport:
    report_id: str
    target_url: str
    verdict: str         # "SCAM_CONFIRMED", "PAUSE_TARGET", or "SAFE"
    confidence: u8       # 0 - 100
    reason: str
    reporter: Address
    timestamp: bigint

class Contract(gl.Contract):
    total_reports: bigint
    total_scams_blocked: bigint
    reports: TreeMap[str, SecurityReport]
    blacklisted_domains: TreeMap[str, bool]
    paused_targets: TreeMap[str, bool]

    def __init__(self):
        self.total_reports = bigint(0)
        self.total_scams_blocked = bigint(0)
        # GenVM auto-initializes TreeMap fields. Do NOT reassign them here.

    @gl.public.write
    def analyze_security_threat(self, target_url: str, check_circuit_breaker: bool) -> str:
        """
        Analyzes a URL (Twitter/X post, phishing link, or security alert) using GenLayer Consensus.
        Validator network reaches 100% semantic consensus on verdict ("SCAM_CONFIRMED", "PAUSE_TARGET", "SAFE").
        """
        if len(target_url) == 0:
            raise UserError("Target URL cannot be empty")

        reporter_addr = gl.message.origin_address

        def leader_fn():
            # Fetch webpage snippet
            web_text = gl.nondet.web.render(target_url, mode="text")
            snippet = web_text[:2000] if len(web_text) > 2000 else web_text

            prompt = f"""You are a GenLayer Security Auditor AI.
Target URL to analyze: {target_url}

Webpage Content Snippet:
{snippet}

Instructions:
1. If the URL or content comes from security alert handles (e.g. CertiKAlert, PeckShieldAlert, SlowMist, SecurityAlert) OR mentions exploits, hacks, vulnerabilities, reentrancy, or flashloan attacks ➔ Return verdict "PAUSE_TARGET".
2. If the URL or content contains phishing scams, fake airdrop claims, wallet drainers, or malicious links ➔ Return verdict "SCAM_CONFIRMED".
3. Otherwise, if it is legitimate documentation or clean content ➔ Return verdict "SAFE".

Return ONLY a valid JSON object with exact keys:
{{
    "verdict": "SCAM_CONFIRMED" | "PAUSE_TARGET" | "SAFE",
    "confidence": integer between 0 and 100,
    "reason": "Clear explanation in English why this URL is classified as SCAM_CONFIRMED, PAUSE_TARGET, or SAFE"
}}
"""
            result = gl.nondet.exec_prompt(prompt, response_format="json")
            return result

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            
            leader_data = leader_res.calldata
            if not isinstance(leader_data, dict) or "verdict" not in leader_data:
                return False

            mine = leader_fn()
            if not isinstance(mine, dict) or "verdict" not in mine:
                return False

            # Consensuate on semantic VERDICT only
            return str(mine["verdict"]).upper() == str(leader_data["verdict"]).upper()

        # Run non-deterministic consensus via GenVM
        analysis_res = gl.vm.run_nondet(leader_fn, validator_fn)

        verdict = str(analysis_res.get("verdict", "SAFE")).upper()
        confidence_val = int(analysis_res.get("confidence", 85))
        reason_text = str(analysis_res.get("reason", "Security analysis complete."))

        # Update state
        self.total_reports = self.total_reports + bigint(1)
        report_id = str(self.total_reports)

        if verdict in ["SCAM_CONFIRMED", "PAUSE_TARGET"]:
            self.total_scams_blocked = self.total_scams_blocked + bigint(1)
            self.blacklisted_domains[target_url] = True
            if check_circuit_breaker:
                self.paused_targets[target_url] = True

        new_report = SecurityReport(
            report_id=report_id,
            target_url=target_url,
            verdict=verdict,
            confidence=u8(min(100, max(0, confidence_val))),
            reason=reason_text,
            reporter=reporter_addr,
            timestamp=bigint(1789485000)
        )

        self.reports[report_id] = new_report
        return report_id

    @gl.public.view
    def get_stats(self) -> str:
        return json.dumps({
            "total_reports": str(self.total_reports),
            "total_scams_blocked": str(self.total_scams_blocked)
        })

    @gl.public.view
    def is_blacklisted(self, target_url: str) -> bool:
        return target_url in self.blacklisted_domains

    @gl.public.view
    def get_report(self, report_id: str) -> str:
        if report_id not in self.reports:
            return json.dumps({"error": "Report not found"})
        
        rep = self.reports[report_id]
        return json.dumps({
            "report_id": rep.report_id,
            "target_url": rep.target_url,
            "verdict": rep.verdict,
            "confidence": int(rep.confidence),
            "reason": rep.reason,
            "reporter": str(rep.reporter),
            "timestamp": str(rep.timestamp)
        })
