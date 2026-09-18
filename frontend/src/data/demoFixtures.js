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
  },
  {
    style_id: '3',
    artist_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    artist_display_name: 'dezzy',
    style_name: 'standX',
    descriptor: 'A Mid-Autumn Festival banner combining soft 3D characters with a dreamy lakeside landscape. A round black mascot with one large green eye and a leaf sits on an ornate mooncake beside a white rabbit. An oversized golden moon backlights the scene, framed by paper lanterns and flowering branches. Deep green, cream, and warm gold dominate the palette, with bold typography on the left and the character composition on the right.',
    protected_traits: 'soft 3D character rendering; warm golden moonlight with deep green and cream tones; oversized glowing full moon behind the main character; round black one-eyed mascot with a green leaf; ornate mooncake pedestal beside a white rabbit',
    license_terms: 'Commercial AI-generated derivatives using this registered style require prior authorization.',
    similarity_threshold: 82,
    minimum_confidence: 75,
    bounty_per_case_wei: '250000000000000000', // 0.25 GEN
    available_bounty_pool: '2000000000000000000', // 2.0 GEN
    reference_manifest_url: 'https://x.com/dezzyyy_eth/status/2100471264427311533',
    reference_manifest_hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    reference_collage_url: 'https://pbs.twimg.com/media/HSZfRwxaMAIogCf.jpg?name=orig',
    active: true,
    confirmed_cases: 0
  },
  {
    style_id: '4',
    artist_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    artist_display_name: 'test',
    style_name: 'arc meme',
    descriptor: 'Eye contours and expressive caricature sketching with playful internet aesthetic motifs.',
    protected_traits: 'eyee; expressive caricature sketching; playful meme aesthetics; distinctive contour lines',
    license_terms: 'Commercial AI-generated derivatives using this registered style require prior authorization.',
    similarity_threshold: 82,
    minimum_confidence: 75,
    bounty_per_case_wei: '100000000000000000', // 0.10 GEN
    available_bounty_pool: '1000000000000000000', // 1.0 GEN
    reference_manifest_url: 'https://stylelock.art/manifests/arc-meme-.json',
    reference_manifest_hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    reference_collage_url: 'https://pbs.twimg.com/media/HSal5StXkAAQGmG.jpg?name=orig',
    active: true,
    confirmed_cases: 0
  },
  {
    style_id: '5',
    artist_address: '0x1cc5e66F0d75beADd6DD3cEFeeE87371aE29971f',
    artist_display_name: 'Vatan Carlos',
    style_name: 'Vatan_Carlos',
    descriptor: 'Yellow Blue Jersey with strong birds composition, bold athletic textures and avian motifs.',
    protected_traits: 'Yellow Blue Jersey with strong birds; bold athletic contours; vibrant yellow and royal blue color harmony',
    license_terms: 'Commercial AI-generated derivatives using this registered style require prior authorization.',
    similarity_threshold: 82,
    minimum_confidence: 75,
    bounty_per_case_wei: '250000000000000000', // 0.25 GEN
    available_bounty_pool: '2500000000000000000', // 2.5 GEN
    reference_manifest_url: 'https://stylelock.art/manifests/vatan_carlos.json',
    reference_manifest_hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    reference_collage_url: 'https://pbs.twimg.com/media/HSa1gXOWsAECHU-.jpg?name=orig',
    active: true,
    confirmed_cases: 0
  }
];

export const INITIAL_CASES = [
  {
    case_id: '1',
    style_id: '1',
    style_name: 'Ink Nocturne',
    hunter_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    suspect_url: 'https://x.com/dezzyyy_eth/status/2100471264427311533',
    claim_text: 'Personal art student experiment practicing ink drawing techniques. No commercial sale or monetization detected.',
    status: 'AMBIGUOUS',
    verdict: 'AMBIGUOUS',
    similarity: 0,
    confidence: 95,
    commercial_use: false,
    commercial_confidence: 70,
    matched_traits: [],
    differences: ['No visual evidence available for comparison'],
    reason: 'The suspect evidence provided contains no rendered visual content or descriptive metadata of the artwork in question. Without visual data, it is impossible to assess similarity to the Ink Nocturne style.',
    reward_allocated: false,
    bounty_amount_wei: '0',
    enforcement_record_id: '',
    txHash: '0x1045756a1167583b0ffce4383d93b3030fe9117e0a043ac18c1a354535fe7528'
  },
  {
    case_id: '2',
    style_id: '1',
    style_name: 'Ink Nocturne',
    hunter_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    suspect_url: 'https://style-lock-dusky.vercel.app/demo-listings/neon-cyber-vectors.html',
    claim_text: 'Checking whether this digital vector bundle violates the Ink Nocturne style profile.',
    status: 'CLEAN',
    verdict: 'CLEAN',
    similarity: 2,
    confidence: 97,
    commercial_use: true,
    commercial_confidence: 99,
    matched_traits: [],
    differences: ['Precision polygonal SVG vector geometry vs rough black ink contours', 'Saturated neon cyan and hot magenta gradients vs muted watercolor palette'],
    reason: 'The Neon Cyber Grid Vector Bundle is a polar opposite in virtually every visual dimension compared to the registered Ink Nocturne style. Zero protected traits are reproduced. Verdict is CLEAN.',
    reward_allocated: false,
    bounty_amount_wei: '0',
    enforcement_record_id: '',
    txHash: '0xcb5d147609b68e04a1fd6fea36b4e3985e5cc3fedfe543f64183fff3c7c5c19d'
  },
  {
    case_id: '3',
    style_id: '3',
    style_name: 'standX',
    hunter_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    suspect_url: 'https://x.com/diaserdropes/status/2100549206637195668',
    claim_text: 'Suspected unauthorized copy exploiting traits of standX (soft 3D character rendering, warm golden moonlight with deep green and cream tones).',
    status: 'AMBIGUOUS',
    verdict: 'AMBIGUOUS',
    similarity: 10,
    confidence: 93,
    commercial_use: false,
    commercial_confidence: 5,
    matched_traits: [],
    differences: ['No visible suspect artwork or page details were provided in the rendered evidence'],
    reason: 'The suspect evidence is effectively inaccessible because the rendered webpage content was empty on raw twitter link, so there is no reliable basis to compare the registered standX trait combination. Requires an AMBIGUOUS verdict.',
    reward_allocated: false,
    bounty_amount_wei: '0',
    enforcement_record_id: '',
    txHash: '0x6e7cf5e510be867e916f1ce7468cbceb486628d9ceca2d550aa4e9bab948902a'
  },
  {
    case_id: '4',
    style_id: '4',
    style_name: 'arc meme',
    hunter_address: '0x659ee75C8a9A45b43781B81B29d930258ec9E92b',
    suspect_url: 'https://fxtwitter.com/diaserdropes/status/2100549206637195668',
    claim_text: 'The layout and interface are somewhat similar to the original version. — Evidence Details: [X Post by @diaserdropes: "🌕✨ Happy Mid-Autumn Festival...". Artwork Image: https://pbs.twimg.com/media/HSal5StXkAAQGmG.jpg?name=orig]',
    status: 'CLEAN',
    verdict: 'CLEAN',
    similarity: 5,
    confidence: 90,
    commercial_use: false,
    commercial_confidence: 95,
    matched_traits: [],
    differences: ['The suspect artwork is a realistic photograph of a moon with minimal stylistic elements, lacking the distinctive eyee visual traits of the registered arc meme style', 'No reproduction of protected traits', 'Noncommercial celebration post'],
    reason: 'The suspect evidence is a photograph of the moon with no stylistic resemblance to the registered arc meme visual style. The image lacks any distinctive line work or compositional elements. Additionally, the post is noncommercial. Verdict is CLEAN.',
    reward_allocated: false,
    bounty_amount_wei: '0',
    enforcement_record_id: '',
    txHash: '0x992b1579a32c7482312ceea0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  }
];
