import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StyleCard from './components/StyleCard';
import SubmitModal from './components/SubmitModal';
import StyleDetailsModal from './components/StyleDetailsModal';
import CaseView from './components/CaseView';
import HunterBoard from './components/HunterBoard';
import ArtistStudio from './components/ArtistStudio';
import DemoMarketView from './components/DemoMarketView';
import SplashScreen from './components/SplashScreen';
import { INITIAL_STYLES, DEMO_PRESETS } from './data/demoFixtures';
import {
  connectWallet,
  getWriteClient,
  getReadClient,
  CONTRACT_ADDRESS,
  extractExecution,
  txExplorerUrl,
  weiToGen
} from './config';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [styles, setStyles] = useState(INITIAL_STYLES);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Modals state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [targetStyleForSubmit, setTargetStyleForSubmit] = useState(null);
  const [selectedPresetForSubmit, setSelectedPresetForSubmit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStyleForDetails, setSelectedStyleForDetails] = useState(null);

  const [claimableReward, setClaimableReward] = useState('0');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const [txBanner, setTxBanner] = useState(null);

  // 1. Fetch on-chain data with consistent pool mapping
  const fetchOnChainData = useCallback(async () => {
    try {
      const client = getReadClient();
      const styleCountRaw = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_style_count',
        args: []
      });
      const count = parseInt(String(styleCountRaw || '0'), 10);
      if (count > 0) {
        const fetchedStyles = [];
        for (let i = 1; i <= count; i++) {
          try {
            const raw = await client.readContract({
              address: CONTRACT_ADDRESS,
              functionName: 'get_style',
              args: [String(i)]
            });
            const parsed = JSON.parse(raw);
            if (parsed && !parsed.error) {
              // Ensure available_bounty_pool is non-zero fallback matching seed
              if (!parsed.available_bounty_pool || parsed.available_bounty_pool === '0') {
                const initialMatch = INITIAL_STYLES.find(s => String(s.style_id) === String(parsed.style_id));
                parsed.available_bounty_pool = initialMatch?.available_bounty_pool || '2000000000000000000';
              }
              fetchedStyles.push(parsed);
            }
          } catch (e) {
            console.warn('Error reading style', i, e);
          }
        }
        if (fetchedStyles.length > 0) {
          setStyles(fetchedStyles);
        }
      }

      const caseCountRaw = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_case_count',
        args: []
      });
      const caseCount = parseInt(String(caseCountRaw || '0'), 10);
      if (caseCount > 0) {
        const fetchedCases = [];
        for (let j = 1; j <= caseCount; j++) {
          try {
            const cRaw = await client.readContract({
              address: CONTRACT_ADDRESS,
              functionName: 'get_case',
              args: [String(j)]
            });
            const cParsed = JSON.parse(cRaw);
            if (cParsed && !cParsed.error) {
              fetchedCases.push(cParsed);
            }
          } catch (e) {
            console.warn('Error reading case', j, e);
          }
        }
        setCases(fetchedCases);
      }
    } catch (err) {
      console.warn('Failed to load on-chain styles/cases:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchOnChainData();
  }, [fetchOnChainData]);

  // 2. Connect Wallet
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const addr = await connectWallet();
      setAccount(addr);
      try {
        const client = getReadClient();
        const rew = await client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_claimable_reward',
          args: [addr]
        });
        setClaimableReward(String(rew || '0'));
      } catch (e) {
        console.warn('Error reading claimable reward:', e);
      }
    } catch (err) {
      alert(err.message || 'Failed to connect MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // 3. Open Submit Modal (Accepts optional preset for auto-fill)
  const handleOpenSubmit = (style = null, preset = null) => {
    const target = style || (preset ? styles.find(s => String(s.style_id) === String(preset.styleId)) : styles[0]);
    setTargetStyleForSubmit(target);
    setSelectedPresetForSubmit(preset);
    setIsSubmitOpen(true);
  };

  // 4. Open Style Details Modal
  const handleOpenDetails = (style) => {
    setSelectedStyleForDetails(style);
    setIsDetailsOpen(true);
  };

  // 5. Submit Case
  const handleSubmitCase = async ({ styleId, suspectUrl, claimText, preset }) => {
    setIsSubmitting(true);
    setTxBanner({ message: 'Submitting evidence to GenLayer validators...', loading: true });

    let activeAccount = account;
    if (!activeAccount && window.ethereum) {
      try {
        activeAccount = await connectWallet();
        setAccount(activeAccount);
      } catch (e) {
        console.warn('Wallet connection note:', e);
      }
    }

    if (activeAccount && window.ethereum) {
      try {
        const client = getWriteClient(activeAccount);
        const hash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'submit_case',
          args: [String(styleId), suspectUrl, claimText]
        });
        const hashStr = typeof hash === 'string' ? hash : String(hash);
        setTxBanner({
          message: 'Waiting for validator consensus on GenLayer...',
          hash: hashStr,
          loading: true
        });

        const receipt = await client.waitForTransactionReceipt({
          hash: hashStr,
          status: 'FINALIZED',
          retries: 200,
          interval: 3000
        });

        const exec = extractExecution(receipt);
        if (exec.execution_result === 'ERROR' || exec.status === 'rollback') {
          throw new Error(exec.payload || 'Transaction rejected on-chain');
        }

        const readClient = getReadClient();
        const countStr = await readClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_case_count',
          args: []
        });
        const latestCaseRaw = await readClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: 'get_case',
          args: [String(countStr)]
        });
        const newCase = JSON.parse(latestCaseRaw);
        newCase.txHash = hashStr;

        setCases(prev => [newCase, ...prev]);
        setSelectedCase(newCase);
        setActiveTab('case');
        setIsSubmitOpen(false);
        setTxBanner({ message: 'Consensus Finalized On-Chain', hash: hashStr, loading: false });
        setTimeout(() => setTxBanner(null), 6000);
        setIsSubmitting(false);
        await fetchOnChainData();
        return;
      } catch (err) {
        console.warn('On-chain write error:', err.message);
        setTxBanner({ message: `Note: ${err.message}. Showing simulated result.`, loading: false });
      }
    }

    // Fallback simulation
    await new Promise(r => setTimeout(r, 1200));

    const p = preset || DEMO_PRESETS[0];
    const isDeriv = p.type === 'DERIVATIVE';
    const isClean = p.type === 'CLEAN';

    const simCase = {
      case_id: String(cases.length + 1),
      style_id: styleId,
      style_name: styles.find(s => String(s.style_id) === String(styleId))?.style_name || 'Ink Nocturne',
      hunter_address: activeAccount || '0x659e...E92b',
      suspect_url: suspectUrl,
      claim_text: claimText,
      status: isDeriv ? 'ENFORCED' : isClean ? 'CLEAN' : 'AMBIGUOUS',
      verdict: p.type,
      similarity: p.expectedSimilarity || (isDeriv ? 88 : 24),
      confidence: p.expectedConfidence || 91,
      commercial_use: p.commercial,
      reward_allocated: isDeriv && p.commercial,
      bounty_amount_wei: isDeriv ? '250000000000000000' : '0',
      enforcement_record_id: isDeriv ? `SL-000${cases.length + 2}` : '',
      matched_traits: isDeriv ? ['rough black ink contours', 'muted watercolor palette', 'asymmetric framing'] : [],
      differences: isClean ? ['sharp neon vector geometry', 'isometric perspective', 'zero watercolor texture'] : [],
      reason: isDeriv
        ? 'GenLayer validators analyzed the suspect listing and reference collage. The suspect listing reproduces registered Ink Nocturne traits (rough black contours, muted washes, asymmetric figures) in a commercial product pack ($14.99).'
        : 'The suspect listing exhibits sharp polygonal vector geometry with high-saturation neon hues. No distinctive traits of the registered watercolor style were reproduced.',
      txHash: '0xcb5d147609b68e04a1fd6fea36b4e3985e5cc3fedfe543f64183fff3c7c5c19d'
    };

    setCases(prev => [simCase, ...prev]);
    setSelectedCase(simCase);
    setActiveTab('case');
    setIsSubmitOpen(false);
    setIsSubmitting(false);
    setTimeout(() => setTxBanner(null), 3000);
  };

  // 6. Claim Bounty
  const handleClaimReward = async () => {
    if (!account) return;
    setIsClaiming(true);
    try {
      const client = getWriteClient(account);
      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: 'claim_reward',
        args: []
      });
      alert(`Bounty claimed! Tx: ${hash}`);
      setClaimableReward('0');
    } catch (e) {
      alert(e.message || 'Claim error');
    } finally {
      setIsClaiming(false);
    }
  };

  // 7. Create Style
  const handleCreateStyle = async (styleData) => {
    setIsCreatingStyle(true);
    try {
      if (account && window.ethereum) {
        const client = getWriteClient(account);
        const hash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'create_style',
          args: [
            styleData.artist_display_name,
            styleData.style_name,
            styleData.descriptor,
            styleData.protected_traits,
            styleData.license_terms,
            styleData.similarity_threshold,
            styleData.minimum_confidence,
            styleData.bounty_per_case_wei,
            styleData.reference_manifest_url,
            styleData.reference_manifest_hash,
            styleData.reference_collage_url
          ]
        });
        alert(`Style registered on-chain! Tx: ${hash}`);
        await fetchOnChainData();
      } else {
        const newStyle = {
          style_id: String(styles.length + 1),
          ...styleData,
          available_bounty_pool: '1000000000000000000',
          active: true,
          confirmed_cases: 0
        };
        setStyles(prev => [...prev, newStyle]);
        alert('Style registered in local session');
      }
      setActiveTab('explore');
    } catch (e) {
      alert(e.message || 'Register style error');
    } finally {
      setIsCreatingStyle(false);
    }
  };

  // Total escrow pool calculated dynamically from styles
  const totalEscrowNum = styles.reduce((acc, s) => {
    const val = Number(weiToGen(s.available_bounty_pool || '0'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 2-Second Initial Intro Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        account={account}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />

      {/* Transaction Banner */}
      {txBanner && (
        <div className="bg-purple-50 border-b border-purple-200 px-4 py-2 text-xs font-mono text-purple-900 flex items-center justify-center gap-3 animate-fade-in">
          <span>{txBanner.message}</span>
          {txBanner.hash && (
            <a
              href={txExplorerUrl(txBanner.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:text-purple-950 font-semibold underline"
            >
              View on Explorer ↗
            </a>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {activeTab === 'explore' && (
          <>
            <Hero
              onRegister={() => setActiveTab('artist')}
              onOpenSubmit={() => handleOpenSubmit()}
              onNavigateTab={(tab) => setActiveTab(tab)}
              stats={{
                totalStyles: styles.length,
                totalCases: cases.length,
                totalEnforcements: cases.filter(c => c.status === 'ENFORCED').length,
                totalEscrow: totalEscrowNum.toFixed(1) + ' GEN'
              }}
            />

            <section id="styles-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Active Protected Styles</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Registered visual identities with precommitted similarity thresholds.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('artist')}
                  className="text-xs font-mono text-purple-700 hover:text-purple-900 font-semibold transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200"
                >
                  + Register Style
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {styles.map(s => (
                  <StyleCard
                    key={s.style_id}
                    style={s}
                    onSelect={(st) => handleOpenDetails(st)}
                    onReport={(st) => handleOpenSubmit(st)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'hunt' && (
          <HunterBoard
            styles={styles}
            onSelectStyle={(s) => handleOpenDetails(s)}
            onOpenSubmit={(s) => handleOpenSubmit(s)}
            claimableReward={claimableReward}
            onClaimReward={handleClaimReward}
            isClaiming={isClaiming}
          />
        )}

        {activeTab === 'artist' && (
          <ArtistStudio
            styles={styles}
            onCreateStyle={handleCreateStyle}
            isCreating={isCreatingStyle}
          />
        )}

        {activeTab === 'market' && (
          <DemoMarketView
            onReportPreset={(item) => {
              const matchedStyle = styles.find(s => String(s.style_id) === String(item.styleId)) || styles[0];
              handleOpenSubmit(matchedStyle, item);
            }}
          />
        )}

        {activeTab === 'case' && selectedCase && (
          <CaseView
            caseData={selectedCase}
            onBack={() => setActiveTab('explore')}
            onClaimReward={handleClaimReward}
            isClaiming={isClaiming}
          />
        )}

      </main>

      {/* Style Details Modal (Separate from Submit) */}
      <StyleDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        style={selectedStyleForDetails}
        onReport={(st) => handleOpenSubmit(st)}
      />

      {/* Submission Modal */}
      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        selectedStyle={targetStyleForSubmit}
        styles={styles}
        initialPreset={selectedPresetForSubmit}
        onSubmit={handleSubmitCase}
        isSubmitting={isSubmitting}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 px-4 text-center text-xs font-mono text-zinc-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-950">STYLELOCK</span>
            <span>•</span>
            <span>On-Chain Style Protection</span>
          </div>
          <div className="text-zinc-400 text-[11px]">
            Decentralized evidence assessment on GenLayer.
          </div>
        </div>
      </footer>

    </div>
  );
}
