/**
 * caseEvaluation.js
 * 
 * Utilities to ensure accurate, unambiguous display of:
 * 1. Visual Similarity (Unreadable image !== 0% similarity)
 * 2. Commercial Use (Unverified usage !== non-commercial)
 * 3. Confidence Scope (Clarifies whether confidence represents certainty of
 *    infringement, certainty of clean status, or certainty that evidence is insufficient)
 */

export function isEvidenceUnreadable(c) {
  if (!c) return false;
  if (c.evidence_status === 'UNREADABLE' || c.evidence_status === 'INACCESSIBLE') return true;
  if (c.similarity === null || c.similarity === undefined || c.similarity === -1) return true;
  
  const reasonText = (c.reason || '').toLowerCase();
  const diffsText = ((c.differences || []).join(' ')).toLowerCase();
  const fullText = `${reasonText} ${diffsText}`;
  
  // Detect if evidence is unreadable or empty
  if (
    fullText.includes('inaccessible') ||
    fullText.includes('no rendered visual') ||
    fullText.includes('no visible suspect artwork') ||
    fullText.includes('empty on raw twitter') ||
    fullText.includes('without visual data') ||
    fullText.includes('corrupted') ||
    fullText.includes('404') ||
    fullText.includes('could not be loaded') ||
    fullText.includes('unreadable') ||
    fullText.includes('no visual evidence available')
  ) {
    // If verdict is AMBIGUOUS or similarity is 0/null/undefined
    if (c.verdict === 'AMBIGUOUS' || c.similarity === 0 || c.similarity === null) {
      return true;
    }
  }
  return false;
}

export function getSimilarityDisplay(c) {
  if (!c) return { value: 'N/A', isUnreadable: true, label: 'N/A (No Data)', short: 'N/A' };
  
  const unreadable = isEvidenceUnreadable(c);
  if (unreadable) {
    return {
      value: 'N/A',
      isUnreadable: true,
      label: 'Unreadable Image',
      detail: 'Image could not be parsed or loaded (not 0% similarity)',
      short: 'N/A (Unreadable)'
    };
  }

  const sim = Number(c.similarity ?? 0);
  return {
    value: `${sim}%`,
    isUnreadable: false,
    label: 'Visual Similarity',
    detail: `${sim}% style similarity against registered traits`,
    short: `${sim}%`
  };
}

export function isCommercialUnverified(c) {
  if (!c) return true;
  if (c.commercial_use === null || c.commercial_use === undefined) return true;
  if (isEvidenceUnreadable(c)) return true;
  if (typeof c.commercial_confidence === 'number' && c.commercial_confidence < 50 && !c.commercial_use) {
    return true;
  }
  if (c.verdict === 'AMBIGUOUS' && !c.commercial_use) {
    return true;
  }
  return false;
}

export function getCommercialDisplay(c) {
  if (!c) {
    return {
      status: 'UNVERIFIED',
      label: 'UNVERIFIED',
      short: 'Unverified',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      detail: 'Commercial intent unverified (insufficient data)'
    };
  }

  if (isCommercialUnverified(c)) {
    return {
      status: 'UNVERIFIED',
      label: 'UNVERIFIED',
      short: 'Unverified',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      detail: 'Insufficient page data to verify commercial use'
    };
  }

  if (c.commercial_use) {
    return {
      status: 'CONFIRMED',
      label: 'CONFIRMED',
      short: 'Yes (Commercial)',
      textColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      detail: 'Commercial intent detected (monetization, store, or paid goods)'
    };
  }

  return {
    status: 'NON_COMMERCIAL',
    label: 'NO (Verified)',
    short: 'No (Non-Commercial)',
    textColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    detail: 'Verified non-commercial or personal fair use'
  };
}

export function getConfidenceScope(c) {
  const conf = Number(c?.confidence ?? 95);
  const verdict = String(c?.verdict || 'AMBIGUOUS').toUpperCase();

  if (verdict === 'DERIVATIVE') {
    return {
      percentage: conf,
      scope: 'Infringement Confirmed',
      meaning: 'Consensus confirms substantial copying of protected traits',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      textColor: 'text-rose-700',
      short: `${conf}% (Infringement)`
    };
  }

  if (verdict === 'CLEAN') {
    return {
      percentage: conf,
      scope: 'No Infringement',
      meaning: 'Consensus confirms artwork is independent or distinct',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      textColor: 'text-emerald-700',
      short: `${conf}% (Clean)`
    };
  }

  // AMBIGUOUS / INSUFFICIENT DATA
  return {
    percentage: conf,
    scope: 'Insufficient Data',
    meaning: 'Consensus confirms evidence is inconclusive or unreadable',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    textColor: 'text-amber-700',
    short: `${conf}% (Insufficient Data)`
  };
}
