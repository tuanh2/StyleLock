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
      labelVi: 'Không đọc được ảnh',
      detail: 'Không thể đọc được ảnh để so khớp (không phải 0% tương đồng)',
      short: 'N/A (Unreadable)'
    };
  }

  const sim = Number(c.similarity ?? 0);
  return {
    value: `${sim}%`,
    isUnreadable: false,
    label: 'Visual Similarity',
    labelVi: 'Độ tương đồng phong cách',
    detail: `${sim}% độ tương đồng so với phong cách đã đăng ký`,
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
      detail: 'Chưa xác minh mục đích thương mại (thiếu dữ liệu)'
    };
  }

  if (isCommercialUnverified(c)) {
    return {
      status: 'UNVERIFIED',
      label: 'UNVERIFIED',
      short: 'Unverified',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      detail: 'Chưa đủ dữ liệu trang để xác minh mục đích thương mại'
    };
  }

  if (c.commercial_use) {
    return {
      status: 'CONFIRMED',
      label: 'CONFIRMED',
      short: 'Yes (Commercial)',
      textColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      detail: 'Phát hiện mục đích thương mại (giá bán, cửa hàng, sản phẩm)'
    };
  }

  return {
    status: 'NON_COMMERCIAL',
    label: 'NO (Verified)',
    short: 'No (Verified Non-Comm)',
    textColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    detail: 'Đã xác minh không có hoạt động thương mại / phi lợi nhuận'
  };
}

export function getConfidenceScope(c) {
  const conf = Number(c?.confidence ?? 95);
  const verdict = String(c?.verdict || 'AMBIGUOUS').toUpperCase();

  if (verdict === 'DERIVATIVE') {
    return {
      percentage: conf,
      scope: 'Infringement Certainty',
      scopeVi: 'Chắc chắn về vi phạm',
      meaning: 'Consensus confirms substantial copying of protected traits',
      meaningVi: 'Đồng thuận chắc chắn phát hiện sao chép phong cách',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      textColor: 'text-rose-700',
      short: `${conf}% (Infringement)`
    };
  }

  if (verdict === 'CLEAN') {
    return {
      percentage: conf,
      scope: 'Non-Infringement Certainty',
      scopeVi: 'Chắc chắn không vi phạm',
      meaning: 'Consensus confirms artwork is independent or distinct',
      meaningVi: 'Đồng thuận chắc chắn tác phẩm không vi phạm bản quyền phong cách',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      textColor: 'text-emerald-700',
      short: `${conf}% (Clean)`
    };
  }

  // AMBIGUOUS / INSUFFICIENT DATA
  return {
    percentage: conf,
    scope: 'Certainty of Insufficient Data',
    scopeVi: 'Chắc chắn chưa đủ dữ liệu',
    meaning: 'Consensus confirms evidence is inconclusive or inaccessible to judge',
    meaningVi: 'Đồng thuận chắc chắn bằng chứng chưa đủ để đưa ra kết luận (không phải 95% vi phạm)',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    textColor: 'text-amber-700',
    short: `${conf}% (Insufficient Data)`
  };
}
