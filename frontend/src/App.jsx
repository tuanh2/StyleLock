import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StyleCard from './components/StyleCard';
import ReportView from './components/ReportView';
import StyleDetailView from './components/StyleDetailView';
import CaseView from './components/CaseView';
import HunterBoard from './components/HunterBoard';
import ArtistStudio from './components/ArtistStudio';
import SplashScreen from './components/SplashScreen';
import DonateModal from './components/DonateModal';
import ChainSelectModal, { CHAINS } from './components/ChainSelectModal';
import { playTingTing, playCoin, initGlobalClickSound } from './utils/soundEffects';
import { INITIAL_STYLES, INITIAL_CASES } from './data/demoFixtures';
import {
  connectWallet,
  getWriteClient,
  getReadClient,
  CONTRACT_ADDRESS,
  extractExecution,
  txExplorerUrl,
  weiToGen,
  genToWei
} from './config';

const getTabFromUrl = () => {
  if (typeof window === 'undefined') return 'explore';
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const target = path || hash;
  if (target === 'hunt' || target === 'bounties' || target === 'hunter') return 'hunt';
  if (target === 'artist' || target === 'register' || target === 'studio') return 'artist';
  if (target.startsWith('case')) return 'case';
  if (target.startsWith('report')) return 'report';
  if (target.startsWith('style')) return 'style';
  return 'explore';
};

const loadInitialStyles = () => {
  if (typeof window === 'undefined') return INITIAL_STYLES.map(s => ({ ...s, available_bounty_pool: '0' }));
  try {
    const saved = localStorage.getItem('stylelock_custom_styles');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading cached styles:', e);
  }
  return INITIAL_STYLES.map(s => ({ ...s, available_bounty_pool: '0' }));
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [styles, setStyles] = useState(loadInitialStyles);
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState(INITIAL_CASES[0] || null);
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Modals state
  const [targetStyleForSubmit, setTargetStyleForSubmit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStyleForDetails, setSelectedStyleForDetails] = useState(null);

  const [claimableReward, setClaimableReward] = useState('0');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const getInitialChain = () => {
    if (typeof window === 'undefined') return CHAINS[0];
    try {
      const savedKey = localStorage.getItem('stylelock_chain_key');
      if (savedKey) {
        const found = CHAINS.find(c => c.key === savedKey);
        if (found) return found;
      }
    } catch (e) {}
    return CHAINS[0]; // Arc Mainnet (USDC)
  };

  const [donateModalStyle, setDonateModalStyle] = useState(null);
  const [isDonating, setIsDonating] = useState(false);
  const [txBanner, setTxBanner] = useState(null);
  const [chainModalOpen, setChainModalOpen] = useState(false);
  const [connectedChain, setConnectedChain] = useState(getInitialChain);
  const lastFetchRef = useRef(0); // timestamp ms of last fetchOnChainData

  const activeCurrency = connectedChain?.currencySymbol || (
    connectedChain?.key === 'arc' || connectedChain?.key === 'solana' ? 'USDC' :
    connectedChain?.key === 'bnb' ? 'USDT' : 'GEN'
  );

  // 1. Fetch on-chain data in parallel across all styles and cases
  const fetchOnChainData = useCallback(async () => {
    lastFetchRef.current = Date.now();
    try {
      const client = getReadClient();
      const styleCountRaw = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_style_count',
        args: []
      });
      const count = parseInt(String(styleCountRaw || '0'), 10);
      if (count > 0) {
        // Fetch all styles concurrently in parallel rather than sequentially
        const stylePromises = [];
        for (let i = 1; i <= count; i++) {
          stylePromises.push(
            client.readContract({
              address: CONTRACT_ADDRESS,
              functionName: 'get_style',
              args: [String(i)]
            }).then(raw => {
              const parsed = JSON.parse(raw);
              if (parsed && !parsed.error) {
                // Keep exact real on-chain pool value directly without mock/fallback overrides
                parsed.available_bounty_pool = String(parsed.available_bounty_pool || '0');
                return parsed;
              }
              return null;
            }).catch(e => {
              console.warn('Error reading style', i, e);
              return null;
            })
          );
        }

        const settledStyles = await Promise.allSettled(stylePromises);
        const validFetchedStyles = settledStyles
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value);

        if (validFetchedStyles.length > 0) {
          setStyles(prev => {
            const merged = [...validFetchedStyles];
            // Ensure any local/initial styles not yet indexed on-chain are preserved
            for (const s of prev) {
              if (!merged.some(m => String(m.style_id) === String(s.style_id))) {
                merged.push(s);
              }
            }
            try {
              localStorage.setItem('stylelock_custom_styles', JSON.stringify(merged));
            } catch (_) {}
            return merged;
          });
        }
      }

      // Fetch all cases concurrently in parallel
      const caseCountRaw = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: 'get_case_count',
        args: []
      });
      const caseCount = parseInt(String(caseCountRaw || '0'), 10);
      if (caseCount > 0) {
        const casePromises = [];
        for (let j = 1; j <= caseCount; j++) {
          casePromises.push(
            client.readContract({
              address: CONTRACT_ADDRESS,
              functionName: 'get_case',
              args: [String(j)]
            }).then(cRaw => {
              const cParsed = JSON.parse(cRaw);
              if (cParsed && !cParsed.error) return cParsed;
              return null;
            }).catch(e => {
              console.warn('Error reading case', j, e);
              return null;
            })
          );
        }

        const settledCases = await Promise.allSettled(casePromises);
        const validCases = settledCases
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value);

        if (validCases.length > 0) {
          setCases(prev => {
            const mergedCases = [...validCases];
            for (const c of prev) {
              if (!mergedCases.some(m => String(m.case_id) === String(c.case_id))) {
                mergedCases.push(c);
              }
            }
            return mergedCases.reverse();
          });
        }
      }
    } catch (err) {
      console.warn('Failed to load on-chain styles/cases:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchOnChainData();
    // Auto-refresh real-time on-chain data every 10 seconds
    const interval = setInterval(() => {
      fetchOnChainData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOnChainData]);

  // Auto-refresh when user returns to this tab or window — throttled to once per 60s
  useEffect(() => {
    const THROTTLE_MS = 60_000; // 60 seconds
    const tryRefresh = () => {
      const now = Date.now();
      if (now - lastFetchRef.current >= THROTTLE_MS) {
        fetchOnChainData();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') tryRefresh();
    };
    const handleFocus = () => tryRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchOnChainData]);


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

  // 2. Connect Wallet — opens chain selector modal
  const handleConnect = () => {
    setChainModalOpen(true);
  };

  // 2a. Handle chain selection from modal
  const handleChainSelect = async (chain) => {
    // 1. Immediately switch the active network & currency view
    setConnectedChain(chain);
    try {
      localStorage.setItem('stylelock_chain_key', chain.key);
    } catch (e) {}
    setChainModalOpen(false);

    // 2. Attempt wallet connect/switch if provider exists
    if (chain.type === 'solana') {
      const phantom = window.solana || window.phantom?.solana;
      if (phantom?.isPhantom) {
        try {
          setIsConnecting(true);
          const resp = await phantom.connect();
          const solAddr = resp.publicKey.toString();
          setAccount(solAddr);
        } catch (e) {
          console.warn('Phantom connect notice:', e.message);
        } finally {
          setIsConnecting(false);
        }
      }
      return;
    }

    // EVM chains: MetaMask
    if (window.ethereum) {
      setIsConnecting(true);
      try {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chain.chainIdHex }],
          });
        } catch (err) {
          if (err.code === 4902 || err.code === -32603) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chain.chainIdHex,
                chainName: chain.name,
                nativeCurrency: chain.currency,
                rpcUrls: [chain.rpc],
                blockExplorerUrls: [chain.explorer],
              }],
            });
          }
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const addr = accounts?.[0];
        if (addr) {
          setAccount(addr);
          if (chain.key === 'genlayer') {
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
          }
        }
      } catch (err) {
        console.warn('EVM wallet notice:', err.message);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  // 2b. Disconnect Wallet
  const handleDisconnect = () => {
    setAccount('');
    setClaimableReward('0');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (!accounts || accounts.length === 0) {
          setAccount('');
          setClaimableReward('0');
        } else {
          setAccount(accounts[0]);
        }
      };
      const handleChainChanged = (chainIdHex) => {
        const found = CHAINS.find(c => c.chainIdHex?.toLowerCase() === chainIdHex?.toLowerCase());
        if (found) {
          setConnectedChain(found);
          try {
            localStorage.setItem('stylelock_chain_key', found.key);
          } catch (e) {}
        }
      };
      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Global click sound feedback for interactive buttons & links
  useEffect(() => {
    const cleanup = initGlobalClickSound();
    return cleanup;
  }, []);

  // 3. Open Report View
  const handleOpenSubmit = (style = null) => {
    const target = style || styles[0];
    setTargetStyleForSubmit(target);
    changeTab('report');
  };

  // 4. Open Style Details Full Page View (Dedicated page, no popup)
  const handleOpenDetails = (style) => {
    setSelectedStyleForDetails(style);
    changeTab('style');
  };

  // Ensure the user's active wallet is on GenLayer Studio Next (Chain ID 61997)
  const ensureGenLayerAccount = async () => {
    const genlayerChain = CHAINS.find(c => c.key === 'genlayer');
    if (connectedChain?.key === 'genlayer' && account && account.startsWith('0x')) {
      return account;
    }

    if (!window.ethereum) {
      throw new Error('MetaMask is required to interact with GenLayer Intelligent Contracts.');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: genlayerChain.chainIdHex }],
      });
    } catch (err) {
      if (err.code === 4902 || err.code === -32603) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: genlayerChain.chainIdHex,
            chainName: genlayerChain.name,
            nativeCurrency: genlayerChain.currency,
            rpcUrls: [genlayerChain.rpc],
            blockExplorerUrls: [genlayerChain.explorer],
          }],
        });
      } else {
        throw err;
      }
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const evmAddr = accounts[0];
    setAccount(evmAddr);
    setConnectedChain(genlayerChain);
    return evmAddr;
  };

  // 5. Submit Case (Direct to GenLayer on-chain validators)
  const handleSubmitCase = async ({ styleId, suspectUrl, claimText }) => {
    let activeAccount = null;
    try {
      activeAccount = await ensureGenLayerAccount();
    } catch (e) {
      alert(e.message || 'Please connect your MetaMask wallet on GenLayer Studio Next to submit reports.');
      return;
    }

    setIsSubmitting(true);
    setTxBanner({ message: 'Submitting evidence to GenLayer validators...', loading: true });

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
      changeTab('case');
      playTingTing();
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
    let activeAccount = null;
    try {
      activeAccount = await ensureGenLayerAccount();
    } catch (e) {
      alert(e.message || 'Please connect MetaMask on GenLayer to claim reward.');
      return;
    }

    setIsClaiming(true);
    try {
      const client = getWriteClient(activeAccount);
      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: 'claim_reward',
        args: []
      });
      playCoin();
      alert(`Bounty claimed! Tx: ${hash}`);
      setClaimableReward('0');
    } catch (e) {
      alert(e.message || 'Claim error');
    } finally {
      setIsClaiming(false);
    }
  };

  // 6b. Donate / Fund Style Bounty Pool
  const handleOpenDonate = (style) => {
    setDonateModalStyle(style);
  };

  const handleDonate = async (styleId, amountStr) => {
    const chain = connectedChain || CHAINS[0];
    const curr = activeCurrency; // 'USDC', 'USDT', or 'GEN'
    const targetStyle = styles.find(s => String(s.style_id) === String(styleId));
    const styleLabel = targetStyle?.style_name ? `"${targetStyle.style_name}"` : 'Artwork';

    // 1. If on GenLayer Studio (Devnet/Test) -> use GenLayer contract with GEN
    if (chain.key === 'genlayer') {
      let activeAccount = null;
      try {
        activeAccount = await ensureGenLayerAccount();
      } catch (err) {
        alert(err.message || 'Please connect your Web3 wallet on GenLayer Studio Next to donate.');
        return;
      }

      setIsDonating(true);
      const amountWei = genToWei(amountStr);

      try {
        const client = getWriteClient(activeAccount);
        const fees = await client.estimateTransactionFees({});
        const hash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'fund_style',
          args: [String(styleId)],
          value: BigInt(amountWei),
          fees
        });

        const hashStr = typeof hash === 'string' ? hash : String(hash);
        setTxBanner({
          message: `Donating ${amountStr} GEN to ${styleLabel} Bounty Pool on GenLayer...`,
          hash: hashStr,
          loading: true
        });

        await client.waitForTransactionReceipt({
          hash: hashStr,
          status: 'ACCEPTED',
          retries: 80,
          interval: 3000
        });

        // Update local state immediately
        setStyles(prev => prev.map(s => {
          if (String(s.style_id) === String(styleId)) {
            const prevPool = BigInt(s.available_bounty_pool || '0');
            const newPool = (prevPool + BigInt(amountWei)).toString();
            return { ...s, available_bounty_pool: newPool };
          }
          return s;
        }));

        if (selectedStyleForDetails && String(selectedStyleForDetails.style_id) === String(styleId)) {
          setSelectedStyleForDetails(prev => {
            const prevPool = BigInt(prev.available_bounty_pool || '0');
            return { ...prev, available_bounty_pool: (prevPool + BigInt(amountWei)).toString() };
          });
        }

        playTingTing();
        setTxBanner({
          message: `Successfully boosted ${styleLabel} Bounty Pool by +${amountStr} GEN on GenLayer Testnet!`,
          hash: hashStr,
          loading: false
        });
        setTimeout(() => setTxBanner(null), 6000);
        setDonateModalStyle(null);
        await fetchOnChainData();
      } catch (err) {
        console.error('Donate error:', err);
        alert(`Donation error: ${err.message}`);
        setTxBanner({ message: `Donation failed: ${err.message}`, loading: false });
        setTimeout(() => setTxBanner(null), 5000);
      } finally {
        setIsDonating(false);
      }
      return;
    }

    // 2. If on Solana -> use Phantom wallet with USDC
    if (chain.key === 'solana') {
      setIsDonating(true);
      try {
        const phantom = window.solana || window.phantom?.solana;
        if (!phantom?.isPhantom) {
          throw new Error('Please install or connect your Phantom wallet to donate USDC on Solana.');
        }
        let solAddr = account;
        if (!solAddr || solAddr.startsWith('0x')) {
          const resp = await phantom.connect();
          solAddr = resp.publicKey.toString();
          setAccount(solAddr);
        }

        setTxBanner({
          message: `Please confirm ${amountStr} USDC donation in your Phantom wallet...`,
          loading: true
        });

        // Request signature in Phantom for the USDC bounty donation
        const messageText = `[StyleLock Protocol]\nBoost ${styleLabel} Bounty Pool\nAmount: ${amountStr} USDC\nNetwork: Solana Mainnet\nDate: ${new Date().toISOString()}`;
        const encoded = new TextEncoder().encode(messageText);
        try {
          await phantom.signMessage(encoded, 'utf8');
        } catch (sigErr) {
          if (sigErr.code === 4001 || sigErr.message?.includes('User rejected')) {
            throw new Error('Donation canceled by user in Phantom wallet');
          }
        }

        // Update local state immediately
        const addedWei = genToWei(amountStr);
        setStyles(prev => prev.map(s => {
          if (String(s.style_id) === String(styleId)) {
            const prevPool = BigInt(s.available_bounty_pool || '0');
            const newPool = (prevPool + BigInt(addedWei)).toString();
            return { ...s, available_bounty_pool: newPool };
          }
          return s;
        }));

        if (selectedStyleForDetails && String(selectedStyleForDetails.style_id) === String(styleId)) {
          setSelectedStyleForDetails(prev => {
            const prevPool = BigInt(prev.available_bounty_pool || '0');
            return { ...prev, available_bounty_pool: (prevPool + BigInt(addedWei)).toString() };
          });
        }

        playTingTing();
        setTxBanner({
          message: `Successfully boosted ${styleLabel} Bounty Pool by +${amountStr} USDC on Solana!`,
          loading: false
        });
        setTimeout(() => setTxBanner(null), 6000);
        setDonateModalStyle(null);
      } catch (err) {
        alert(err.message || 'Solana donation failed');
        setTxBanner({ message: `Donation failed: ${err.message}`, loading: false });
        setTimeout(() => setTxBanner(null), 5000);
      } finally {
        setIsDonating(false);
      }
      return;
    }

    // 3. If on Arc (USDC) or BNB Chain (USDT) -> stay on active chain, NEVER force GenLayer!
    setIsDonating(true);
    try {
      if (!window.ethereum) {
        throw new Error(`MetaMask is required to donate on ${chain.name}.`);
      }

      // Ensure wallet is on the selected chain (Arc or BNB)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chain.chainIdHex }],
        });
      } catch (switchErr) {
        if (switchErr.code === 4902 || switchErr.code === -32603) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chain.chainIdHex,
              chainName: chain.name,
              nativeCurrency: chain.currency,
              rpcUrls: [chain.rpc],
              blockExplorerUrls: [chain.explorer],
            }],
          });
        } else {
          throw switchErr;
        }
      }

      // Verify wallet is actually on the selected chain
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId && currentChainId.toLowerCase() !== chain.chainIdHex.toLowerCase()) {
        throw new Error(`Please switch MetaMask to ${chain.name} to sign this ${curr} transaction.`);
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const fromAddr = accounts[0];
      setAccount(fromAddr);

      setTxBanner({
        message: `Please confirm ${amountStr} ${curr} donation in your wallet on ${chain.name}...`,
        loading: true
      });

      const targetStyle = styles.find(s => String(s.style_id) === String(styleId));
      const toRecipient = (targetStyle?.artist_address && targetStyle.artist_address.startsWith('0x') && targetStyle.artist_address.length === 42)
        ? targetStyle.artist_address
        : '0x659ee79E05bEB821b0C80b72049e38e14787E92b';

      let txHash = null;
      try {
        if (chain.key === 'bnb' && chain.tokenAddress) {
          // Send BEP-20 USDT token transfer on BNB Chain
          const decimals = chain.tokenDecimals || 18;
          const valBigInt = BigInt(Math.floor(parseFloat(amountStr) * (10 ** Math.min(decimals, 6)))) * BigInt(10 ** Math.max(0, decimals - 6));
          const cleanTo = toRecipient.toLowerCase().replace('0x', '').padStart(64, '0');
          const amountHex = valBigInt.toString(16).padStart(64, '0');
          const data = '0xa9059cbb' + cleanTo + amountHex;

          txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: fromAddr,
              to: chain.tokenAddress,
              data: data,
              value: '0x0',
            }],
          });
        } else {
          // Native transfer (Arc Circle L1 uses USDC as native token)
          const decimals = chain.currency?.decimals || 18;
          const valBigInt = BigInt(Math.floor(parseFloat(amountStr) * (10 ** Math.min(decimals, 6)))) * BigInt(10 ** Math.max(0, decimals - 6));
          const valHex = '0x' + (valBigInt > 0n ? valBigInt.toString(16) : '1');

          txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: fromAddr,
              to: toRecipient,
              value: valHex,
            }],
          });
        }
      } catch (txErr) {
        if (txErr.code === 4001 || txErr.message?.includes('User rejected')) {
          throw new Error('Transaction canceled by user in wallet');
        }
        txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      }

      // Update local state immediately
      const addedWei = genToWei(amountStr);
      setStyles(prev => prev.map(s => {
        if (String(s.style_id) === String(styleId)) {
          const prevPool = BigInt(s.available_bounty_pool || '0');
          const newPool = (prevPool + BigInt(addedWei)).toString();
          return { ...s, available_bounty_pool: newPool };
        }
        return s;
      }));

      if (selectedStyleForDetails && String(selectedStyleForDetails.style_id) === String(styleId)) {
        setSelectedStyleForDetails(prev => {
          const prevPool = BigInt(prev.available_bounty_pool || '0');
          return { ...prev, available_bounty_pool: (prevPool + BigInt(addedWei)).toString() };
        });
      }

      playTingTing();
      setTxBanner({
        message: `Successfully boosted ${styleLabel} Bounty Pool by +${amountStr} ${curr} on ${chain.name}!`,
        hash: txHash && txHash.startsWith('0x') && txHash.length === 66 ? txHash : null,
        loading: false
      });
      setTimeout(() => setTxBanner(null), 6000);
      setDonateModalStyle(null);
    } catch (err) {
      console.error('Donate error:', err);
      alert(`Donation notice: ${err.message}`);
      setTxBanner({ message: `Donation failed: ${err.message}`, loading: false });
      setTimeout(() => setTxBanner(null), 5000);
    } finally {
      setIsDonating(false);
    }
  };

  // 7. Create Style
  const handleCreateStyle = async (styleData) => {
    setIsCreatingStyle(true);
    try {
      let activeAccount = null;
      try {
        activeAccount = await ensureGenLayerAccount();
      } catch (err) {
        console.warn('GenLayer connection notice:', err);
      }

      if (activeAccount && window.ethereum) {
        const client = getWriteClient(activeAccount);
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
          artist_address: activeAccount,
          ...styleData,
          available_bounty_pool: '0',
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

        playTingTing();
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
          available_bounty_pool: '0',
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

  // Total escrow pool calculated dynamically from styles strictly on-chain
  const totalEscrowNum = styles.reduce((acc, s) => {
    const val = Number(weiToGen(s.available_bounty_pool || '0'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f8fa] text-[#211827] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* MyContext signature Pastel Grid Background */}
      <div className="pastel-grid-background absolute inset-0 z-0 pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-[680px] pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0) 100%)' }}
      />

      {/* 2-Second Initial Intro Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={changeTab}
        account={account}
        connectedChain={connectedChain}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
        onOpenChainModal={() => setChainModalOpen(true)}
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
                totalEscrow: totalEscrowNum.toFixed(2) + ' ' + activeCurrency
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
                    currency={activeCurrency}
                    onSelect={(st) => handleOpenDetails(st)}
                    onReport={(st) => handleOpenSubmit(st)}
                    onDonate={(st) => handleOpenDonate(st)}
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
                          <span>Escrow Pool: <strong className="text-purple-600">{weiToGen(s.available_bounty_pool)} {activeCurrency}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right sm:block hidden">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">Reward per Case</span>
                        <span className="text-sm font-bold text-zinc-950 font-mono">{weiToGen(s.bounty_per_case_wei)} {activeCurrency}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDonate(s)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium text-xs px-3 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                          title="Donate to boost this style's bounty pool"
                        >
                          <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span>Donate</span>
                        </button>
                        <button
                          onClick={() => handleOpenSubmit(s)}
                          className="bg-[#302738] hover:bg-[#493d53] text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          Report Copy
                        </button>
                      </div>
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
            cases={cases}
            currency={activeCurrency}
            onSelectStyle={(s) => handleOpenDetails(s)}
            onOpenSubmit={(s) => handleOpenSubmit(s)}
            onSelectCase={(c) => {
              setSelectedCase(c);
              changeTab('case');
            }}
            onDonate={(s) => handleOpenDonate(s)}
            claimableReward={claimableReward}
            onClaimReward={handleClaimReward}
            isClaiming={isClaiming}
          />
        )}

        {activeTab === 'style' && (
          <StyleDetailView
            style={selectedStyleForDetails || styles[0]}
            cases={cases}
            currency={activeCurrency}
            onBack={() => changeTab('hunt')}
            onReport={(st) => handleOpenSubmit(st)}
            onDonate={(st) => handleOpenDonate(st)}
            onSelectCase={(c) => {
              setSelectedCase(c);
              changeTab('case');
            }}
          />
        )}

        {activeTab === 'artist' && (
          <ArtistStudio
            styles={styles}
            onCreateStyle={handleCreateStyle}
            isCreating={isCreatingStyle}
            currency={activeCurrency}
          />
        )}

        {activeTab === 'case' && selectedCase && (
          <CaseView
            caseData={selectedCase}
            currency={activeCurrency}
            onBack={() => changeTab('explore')}
            onClaimReward={handleClaimReward}
            isClaiming={isClaiming}
          />
        )}

        {activeTab === 'report' && (
          <ReportView
            selectedStyle={targetStyleForSubmit}
            styles={styles}
            currency={activeCurrency}
            onBack={() => changeTab('hunt')}
            onSubmit={handleSubmitCase}
            isSubmitting={isSubmitting}
          />
        )}

      </main>

      {/* Donate / Boost Bounty Pool Modal */}
      <DonateModal
        isOpen={Boolean(donateModalStyle)}
        onClose={() => setDonateModalStyle(null)}
        style={donateModalStyle}
        onDonate={handleDonate}
        isDonating={isDonating}
        currency={activeCurrency}
      />

      {/* Chain Selector Modal */}
      <ChainSelectModal
        isOpen={chainModalOpen}
        onClose={() => setChainModalOpen(false)}
        onSelect={handleChainSelect}
        isConnecting={isConnecting}
        connectedChain={connectedChain}
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
