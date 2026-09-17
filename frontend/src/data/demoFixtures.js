// Real demo listings hosted statically in /demo-listings/
const getListingUrl = (path) => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}${path}`;
  }
  return `http://localhost:3000${path}`;
};

export const DEMO_PRESETS = [
  {
    id: 'derivative-1',
    label: '🔴 AI Asset Pack (Commercial Derivative)',
    type: 'DERIVATIVE',
    styleId: '1',
    styleName: 'Ink Nocturne',
    url: getListingUrl('/demo-listings/moody-ink-artpack.html'),
    title: 'Moody Ink Noir AI Illustration Pack — $14.99',
    store: 'PromptMarket Hub',
    price: '$14.99 USD',
    license: 'Commercial Royalty-Free License included',
    commercial: true,
    expectedVerdict: 'DERIVATIVE',
    expectedSimilarity: 88,
    expectedConfidence: 91,
    claim: "Commercial AI storefront selling 12 downloadable watercolor illustrations imitating Alice Kim's Ink Nocturne style with rough black contours, muted washes, and asymmetric framing.",
    image: '/images/ink-nocturne.jpg',
    description: '12 high-resolution AI generated graphics featuring rough dark contour lines, atmospheric watercolor textures, and melancholic human silhouettes in sparse compositions. Perfect for commercial merch.'
  },
  {
    id: 'clean-1',
    label: '🟢 Cyberpunk Vectors (Clean / Different Style)',
    type: 'CLEAN',
    styleId: '1',
    styleName: 'Ink Nocturne',
    url: getListingUrl('/demo-listings/neon-cyber-vectors.html'),
    title: 'Neon Cyber Grid Vector Bundle — $8.00',
    store: 'VectorForge Studio',
    price: '$8.00 USD',
    license: 'Commercial License',
    commercial: true,
    expectedVerdict: 'CLEAN',
    expectedSimilarity: 24,
    expectedConfidence: 94,
    claim: 'Checking whether this digital vector bundle violates the Ink Nocturne style profile.',
    image: '/images/neon-geometry.jpg',
    description: 'High-tech isometric vector polygons with electric cyan and magenta gradients, sharp hard edges, and clean modern grid geometry.'
  },
  {
    id: 'ambiguous-1',
    label: '🟡 Student Study (Non-commercial Fan Art)',
    type: 'AMBIGUOUS',
    styleId: '1',
    styleName: 'Ink Nocturne',
    url: getListingUrl('/demo-listings/rough-ink-student-study.html'),
    title: 'Rough Ink Study (Student Portfolio Practice)',
    store: 'ArtCommunity Free Gallery',
    price: 'Free / Non-commercial',
    license: 'CC-BY-NC (Personal Educational Study only)',
    commercial: false,
    expectedVerdict: 'AMBIGUOUS',
    expectedSimilarity: 72,
    expectedConfidence: 86,
    claim: 'Personal art student experiment practicing ink drawing techniques. No commercial sale or monetization detected.',
    image: '/images/student-sketch.jpg',
    description: 'A student study exploring watercolor washes and contour sketching. Shared for peer feedback and educational practice only.'
  }
];

export const INITIAL_STYLES = [
  {
    style_id: '1',
    artist_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    artist_display_name: 'Alice Kim',
    style_name: 'Ink Nocturne',
    descriptor: 'Moody watercolor illustrations with rough black ink contours, muted blue and brown palette, asymmetric framing, sparse backgrounds, elongated human proportions and visible paper texture.',
    protected_traits: 'rough black ink contours; muted watercolor palette; asymmetric framing; sparse composition; elongated proportions',
    license_terms: 'Commercial AI-generated derivatives using this registered style are strictly prohibited without prior authorization.',
    similarity_threshold: 82,
    minimum_confidence: 75,
    bounty_per_case_wei: '250000000000000000', // 0.25 GEN
    available_bounty_pool: '2500000000000000000', // 2.5 GEN
    reference_manifest_url: 'https://stylelock.art/manifests/ink-nocturne.json',
    reference_manifest_hash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    reference_collage_url: '/images/ink-nocturne.jpg',
    active: true,
    confirmed_cases: 1
  },
  {
    style_id: '2',
    artist_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    artist_display_name: 'Marcus Vance',
    style_name: 'Neon Geometry',
    descriptor: 'Flat vector compositions with sharp polygonal geometry, neon orange and electric cyan on deep navy backgrounds, isometric perspectives, and minimalist shadows.',
    protected_traits: 'sharp polygonal geometry; neon orange and electric cyan; deep navy backgrounds; isometric framing; minimal hard shadows',
    license_terms: 'Commercial generative models trained or imitating these geometric motifs require licensing.',
    similarity_threshold: 80,
    minimum_confidence: 70,
    bounty_per_case_wei: '150000000000000000', // 0.15 GEN
    available_bounty_pool: '1500000000000000000', // 1.5 GEN
    reference_manifest_url: 'https://stylelock.art/manifests/neon-geometry.json',
    reference_manifest_hash: '0x5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    reference_collage_url: '/images/neon-geometry.jpg',
    active: true,
    confirmed_cases: 0
  }
];
