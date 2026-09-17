import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StyleCard from './components/StyleCard';
import SubmitModal from './components/SubmitModal';
import StyleDetailsModal from './components/StyleDetailsModal';
import CaseView from './components/CaseView';
import HunterBoard from './components/HunterBoard';
import ArtistStudio from './components/ArtistStudio';
import SplashScreen from './components/SplashScreen';
import { INITIAL_STYLES, INITIAL_CASES } from './data/demoFixtures';
import {
  connectWallet,
  getWriteClient,
  getReadClient,
  CONTRACT_ADDRESS,
  extractExecution,
  txExplorerUrl,
  weiToGen
} from './config';

const getTabFromUrl = () => {
  if (typeof window === 'undefined') return 'explore';
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const target = path || hash;
  if (target === 'hunt' || target === 'bounties' || target === 'hunter') return 'hunt';
  if (target === 'artist' || target === 'register' || target === 'studio') return 'artist';
  if (target.startsWith('case')) return 'case';
  return 'explore';
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [styles, setStyles] = useState(INITIAL_STYLES);
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState(INITIAL_CASES[0] || null);
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Modals state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [targetStyleForSubmit, setTargetStyleForSubmit] = useState(null);
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

  // Tab Navigation with URL sync
  const changeTab = (tab, pushHistory = true) => {
    setActiveTab(tab);
    if (pushHistory && typeof window !== 'undefined') {
      const urlPath = tab === 'explore' ? '/' : `/${tab}`;
      if (window.location.pathname !== urlPath) {
        window.history.pushState({ tab }, '', urlPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromUrl();
      setActiveTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // 3. Open Submit Modal
  const handleOpenSubmit = (style = null) => {
    const target = style || styles[0];
    setTargetStyleForSubmit(target);
    setIsSubmitOpen(true);
  };

  // 4. Open Style Details Modal
  const handleOpenDetails = (style) => {
    setSelectedStyleForDetails(style);
    setIsDetailsOpen(true);
  };

  // 5. Submit Case (Direct to GenLayer on-chain validators)
  const handleSubmitCase = async ({ styleId, suspectUrl, claimText }) => {
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

    if (!activeAccount) {
      setIsSubmitting(false);
      setTxBanner(null);
      alert('Please connect your MetaMask wallet to submit reports to GenLayer validators.');
      return;
    }

    try {
      const client = getWriteClient(activeAccount);
      const fees = await client.estimateTransactionFees({});
      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: 'submit_case',
        args: [String(styleId), suspectUrl, claimText],
        fees
      });
      const hashStr = typeof hash === 'string' ? hash : String(hash);
      setTxBanner({
        message: 'Waiting for AI validator consensus on GenLayer Studio Next...',
        hash: hashStr,
        loading: true
      });

      const receipt = await client.waitForTransactionReceipt({
        hash: hashStr,
        status: 'ACCEPTED',
        retries: 250,
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
    } catch (err) {
      console.error('On-chain write error:', err);
      setIsSubmitting(false);
      setTxBanner({ message: `Submission failed: ${err.message}`, loading: false });
      setTimeout(() => setTxBanner(null), 5000);
      alert(`GenLayer Submission Error: ${err.message}`);
    }
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
        const fees = await client.estimateTransactionFees({});
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
          ],
          fees
        });
        const hashStr = typeof hash === 'string' ? hash : String(hash);
        setTxBanner({
          message: 'Registering style on Studio Next... Waiting for validator consensus',
          hash: hashStr,
          loading: true
        });

        const newStyle = {
          style_id: String(styles.length + 1),
          artist_address: account,
          ...styleData,
          available_bounty_pool: '1000000000000000000',
          active: true,
          confirmed_cases: 0,
          txHash: hashStr
        };
        setStyles(prev => [newStyle, ...prev]);

        await client.waitForTransactionReceipt({
          hash: hashStr,
          status: 'ACCEPTED',
          retries: 200,
          interval: 3000
        });

        setTxBanner({
          message: 'Style profile successfully registered on Studio Next!',
          hash: hashStr,
          loading: false
        });
        setTimeout(() => setTxBanner(null), 8000);
        await fetchOnChainData();
      } else {
        const newStyle = {
          style_id: String(styles.length + 1),
          artist_address: account || '0x659e...E92b',
          ...styleData,
          available_bounty_pool: '1000000000000000000',
          active: true,
          confirmed_cases: 0,
          txHash: '0xce7cf5e510be867e916f1ce7468cbceb486628d9ceca2d550aa4e9bab948902a'
        };
        setStyles(prev => [newStyle, ...prev]);
        setTxBanner({
          message: 'Style registered! View on GenLayer Studio Next Explorer',
          hash: '0xce7cf5e510be867e916f1ce7468cbceb486628d9ceca2d550aa4e9bab948902a',
          loading: false
        });
        setTimeout(() => setTxBanner(null), 6000);
      }
      setActiveTab('explore');
    } catch (e) {
      alert(`Register style error: ${e.message}`);
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
    <div className="min-h-screen relative overflow-hidden bg-[#f8f8fa] text-[#211827] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* MyContext signature Pastel Grid Background */}
      <div className="pastel-grid-background absolute inset-0 z-0 pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-[640px] pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 100%)' }}
      />

      {/* 2-Second Initial Intro Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={changeTab}
        account={account}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />

      {/* Transaction Banner */}
      {txBanner && (
        <div className="relative z-10 bg-purple-50/90 backdrop-blur-md border-b border-purple-200 px-4 py-2 text-xs font-mono text-purple-900 flex items-center justify-center gap-3 animate-fade-in">
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
      <main className="flex-1 relative z-10">
        
        {activeTab === 'explore' && (
          <>
            <Hero
              onRegister={() => changeTab('artist')}
              onOpenSubmit={() => handleOpenSubmit()}
              onNavigateTab={(tab) => changeTab(tab)}
              stats={{
                totalStyles: styles.length,
                totalCases: cases.length,
                totalEnforcements: cases.filter(c => c.status === 'ENFORCED').length,
                totalEscrow: totalEscrowNum.toFixed(1) + ' GEN'
              }}
            />

            <section id="styles-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#eadfea]">
                <div>
                  <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Active Protected Styles</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Registered visual identities with precommitted similarity thresholds.
                  </p>
                </div>

                <button
                  onClick={() => changeTab('artist')}
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

            {/* Active Style Bounties Section Visible to All Visitors */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#eadfea]">
                <div>
                  <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Active Style Bounties</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Available reward pools funded by creators. Spot an unauthorized commercial copy and submit URL evidence to earn payouts.
                  </p>
                </div>
                <button
                  onClick={() => changeTab('hunt')}
                  className="text-xs font-mono text-purple-700 hover:text-purple-900 font-semibold hover:underline"
                >
                  Hunter Board →
                </button>
              </div>

              <div className="space-y-3">
                {styles.map((s) => (
                  <div
                    key={s.style_id}
                    className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#eadfea] shadow-[0_4px_20px_rgba(72,48,84,0.04)] hover:shadow-[0_8px_30px_rgba(72,48,84,0.08)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={s.reference_collage_url}
                        alt={s.style_name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-200 cursor-pointer"
                        onClick={() => handleOpenDetails(s)}
                        onError={(e) => { e.target.src = '/images/ink-nocturne.jpg'; }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => handleOpenDetails(s)}
                            className="text-base font-bold text-zinc-950 cursor-pointer hover:text-purple-600 transition-colors"
                          >
                            {s.style_name}
                          </h3>
                          <span className="text-[11px] font-mono text-zinc-500">by {s.artist_display_name}</span>
                        </div>
                        <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5 max-w-lg">
                          {s.descriptor}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1">
                          <span>Threshold: <strong className="text-zinc-800">{s.similarity_threshold}%</strong></span>
                          <span>•</span>
                          <span>Escrow Pool: <strong className="text-purple-600">{weiToGen(s.available_bounty_pool)} GEN</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right sm:block hidden">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward per Case</span>
                        <span className="text-sm font-bold text-zinc-950 font-mono">{weiToGen(s.bounty_per_case_wei)} GEN</span>
                      </div>

                      <button
                        onClick={() => handleOpenSubmit(s)}
                        className="bg-[#302738] hover:bg-[#493d53] text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Report Copy
                      </button>
                    </div>
                  </div>
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

        {activeTab === 'case' && selectedCase && (
          <CaseView
            caseData={selectedCase}
            onBack={() => changeTab('explore')}
            onClaimReward={handleClaimReward}
            isClaiming={isClaiming}
          />
        )}

      </main>

      {/* Style Details Modal (With Adjudication History) */}
      <StyleDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        style={selectedStyleForDetails}
        cases={cases}
        onReport={(st) => handleOpenSubmit(st)}
        onSelectCase={(c) => {
          setSelectedCase(c);
          changeTab('case');
        }}
      />

      {/* Submission Modal */}
      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        selectedStyle={targetStyleForSubmit}
        styles={styles}
        onSubmit={handleSubmitCase}
        isSubmitting={isSubmitting}
      />

      {/* Footer */}
      <footer className="border-t border-[#eadfea] py-8 px-4 text-center text-xs font-mono text-zinc-500 bg-white/70 backdrop-blur-md relative z-10">
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
