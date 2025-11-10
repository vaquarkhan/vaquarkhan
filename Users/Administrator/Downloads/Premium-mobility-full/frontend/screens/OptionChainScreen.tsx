import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OptionChainResponse, OptionChainRowData, OptionContract } from '../types';
import { XIcon, SparklesIcon } from '../components/icons/Icons';

interface OptionChainScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

type FetchState = 'idle' | 'loading' | 'success' | 'error';

const STRIKE_COUNT = 24;
const STRIKE_GAP = 50;
const BASE_STRIKE = 22000;
const UPDATE_INTERVAL = 2000;

const OptionChainScreen: React.FC<OptionChainScreenProps> = ({ isOpen, onClose }) => {
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [response, setResponse] = useState<OptionChainResponse | null>(null);
  const [lastSpotPrice, setLastSpotPrice] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLoading = fetchState === 'loading';

  const highlightStrike = useMemo(() => {
    if (!response) return null;
    const closest = response.chainData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.strikePrice - response.spotPrice);
      const currDiff = Math.abs(curr.strikePrice - response.spotPrice);
      return currDiff < prevDiff ? curr : prev;
    });
    return closest.strikePrice;
  }, [response]);

  const stopRealtimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startRealtimeUpdates = useCallback(() => {
    stopRealtimeUpdates();
    intervalRef.current = setInterval(() => {
      setResponse((prev) => {
        if (!prev) return prev;
        const updatedRows = prev.chainData.map((row) => {
          if (Math.random() > 0.3) return row;

          const mutateContract = (contract: OptionContract): OptionContract => {
            const delta = -1 + Math.random() * 2;
            const newLtp = Math.max(0, contract.ltp + delta);
            return {
              ...contract,
              ltp: Number(newLtp.toFixed(2)),
              change: Number(delta.toFixed(2)),
            };
          };

          return {
            ...row,
            call: mutateContract(row.call),
            put: mutateContract(row.put),
          };
        });

        const spotDelta = -2 + Math.random() * 4;
        const newSpot = Math.max(0, prev.spotPrice + spotDelta);
        setLastSpotPrice(prev.spotPrice);

        return {
          ...prev,
          spotPrice: Number(newSpot.toFixed(2)),
          chainData: updatedRows,
        };
      });
    }, UPDATE_INTERVAL);
  }, [stopRealtimeUpdates]);

  const generateMockData = useCallback((): OptionChainResponse => {
    const expiryDates = ['2025-03-27', '2025-04-03', '2025-04-10'];
    const spotPrice = BASE_STRIKE + 120;

    const rows: OptionChainRowData[] = Array.from({ length: STRIKE_COUNT }, (_, index) => {
      const strikePrice = BASE_STRIKE + index * STRIKE_GAP;

      const buildContract = (): OptionContract => ({
        ltp: Number((120 + Math.random() * 40).toFixed(2)),
        change: Number((-2 + Math.random() * 4).toFixed(2)),
        iv: Number((12 + Math.random() * 6).toFixed(2)),
        volume: Math.floor(1500 + Math.random() * 3500),
        oi: Math.floor(10000 + Math.random() * 35000),
        changeInOI: Math.floor(-200 + Math.random() * 400),
        bidPrice: Number((110 + Math.random() * 20).toFixed(2)),
        bidQty: Math.floor(50 + Math.random() * 80),
        askPrice: Number((125 + Math.random() * 20).toFixed(2)),
        askQty: Math.floor(55 + Math.random() * 70),
      });

      return {
        strikePrice,
        call: buildContract(),
        put: buildContract(),
      };
    });

    return {
      instrumentName: 'NIFTY 50',
      spotPrice,
      expiryDates,
      chainData: rows,
    };
  }, []);

  const fetchData = useCallback(async () => {
    setFetchState('loading');
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockData = generateMockData();
      setResponse(mockData);
      setSelectedExpiry(mockData.expiryDates[0]);
      setLastSpotPrice(mockData.spotPrice);
      setFetchState('success');
    } catch (err) {
      console.error(err);
      setError('Unable to load option chain. Please try again.');
      setFetchState('error');
    }
  }, [generateMockData]);

  useEffect(() => {
    if (!isOpen) {
      stopRealtimeUpdates();
      return;
    }
    fetchData();
    return () => {
      stopRealtimeUpdates();
    };
  }, [isOpen, fetchData, stopRealtimeUpdates]);

  useEffect(() => {
    if (fetchState === 'success') {
      startRealtimeUpdates();
    }
  }, [fetchState, startRealtimeUpdates]);

  const handleExpiryChange = (expiry: string) => {
    setSelectedExpiry(expiry);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-lg bg-black/70 flex items-center justify-center px-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-700/60 to-purple-500/40">
          <div>
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">Option Chain</h2>
            </div>
            <p className="text-sm text-white/70 mt-1">
              {response?.instrumentName ?? 'Loading...'}
              {response && (
                <span className="ml-3 text-white">
                  Spot: <SpotPrice value={response.spotPrice} previous={lastSpotPrice ?? response.spotPrice} />
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              stopRealtimeUpdates();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            aria-label="Close option chain"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-slate-900/60 to-slate-950/40">
          <div className="px-6 py-3 border-b border-white/5">
            {response && (
              <ExpiryChips
                expiries={response.expiryDates}
                selected={selectedExpiry}
                onSelect={handleExpiryChange}
              />
            )}
          </div>

            <div className="flex-1 overflow-auto px-6 py-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-sm text-white/70">Loading option chain...</p>
                </div>
              )}

              {fetchState === 'error' && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <p className="text-red-400 font-medium">{error}</p>
                  <button
                    onClick={fetchData}
                    className="bg-purple-500 hover:bg-purple-600 transition-colors px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}

              {response && fetchState === 'success' && (
                <div className="space-y-2">
                  <OptionChainHeader />
                  <div className="space-y-2">
                    {response.chainData.map((row) => (
                      <OptionChainRow
                        key={row.strikePrice}
                        data={row}
                        isAtm={highlightStrike === row.strikePrice}
                        onAction={(leg) =>
                          showToast(`${leg === 'call' ? 'Buy Call' : 'Buy Put'} at ₹${row.strikePrice.toFixed(0)}`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

const ExpiryChips: React.FC<{
  expiries: string[];
  selected: string;
  onSelect: (expiry: string) => void;
}> = ({ expiries, selected, onSelect }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
      {expiries.map((expiry) => {
        const isActive = expiry === selected;
        return (
          <button
            key={expiry}
            onClick={() => onSelect(expiry)}
            className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium whitespace-nowrap ${
              isActive
                ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/40'
                : 'bg-black/20 border-white/10 text-white/70 hover:bg-purple-500/20 hover:border-purple-400/40'
            }`}
          >
            {expiry}
          </button>
        );
      })}
    </div>
  );
};

const OptionChainHeader: React.FC = () => (
  <div className="grid grid-cols-7 text-xs font-semibold text-white/70 uppercase tracking-widest bg-white/5 px-4 py-3 rounded-lg border border-white/10">
    <div className="col-span-3 flex justify-between">
      <span>Call OI</span>
      <span>Call IV</span>
      <span>Call LTP</span>
    </div>
    <div className="flex items-center justify-center text-white">Strike</div>
    <div className="col-span-3 flex justify-between">
      <span>Put LTP</span>
      <span>Put IV</span>
      <span>Put OI</span>
    </div>
  </div>
);

const OptionChainRow: React.FC<{
  data: OptionChainRowData;
  isAtm: boolean;
  onAction: (leg: 'call' | 'put') => void;
}> = ({ data, isAtm, onAction }) => {
  const ltpColor = (change: number) => (change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-white');

  const renderContract = (contract: OptionContract, leg: 'call' | 'put') => (
    <div
      className="flex flex-1 items-center justify-between px-3 cursor-pointer"
      onClick={() => onAction(leg)}
      role="button"
      tabIndex={0}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          onAction(leg);
        }
      }}
    >
      {leg === 'call' ? (
        <>
          <span className="w-1/3 text-xs text-white/80 text-left">{contract.oi.toLocaleString()}</span>
          <span className="w-1/3 text-xs text-white/80 text-center">{contract.iv.toFixed(2)}%</span>
          <span className={`w-1/3 text-right text-sm font-semibold ${ltpColor(contract.change)}`}>
            ₹{contract.ltp.toFixed(2)}
          </span>
        </>
      ) : (
        <>
          <span className={`w-1/3 text-left text-sm font-semibold ${ltpColor(contract.change)}`}>
            ₹{contract.ltp.toFixed(2)}
          </span>
          <span className="w-1/3 text-center text-xs text-white/80">{contract.iv.toFixed(2)}%</span>
          <span className="w-1/3 text-right text-xs text-white/80">{contract.oi.toLocaleString()}</span>
        </>
      )}
    </div>
  );

  return (
    <div
      className={`grid grid-cols-7 px-4 py-3 rounded-lg border transition-colors ${
        isAtm ? 'bg-purple-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20' : 'bg-black/30 border-white/5'
      }`}
    >
      <div className="col-span-3 flex items-center divide-x divide-white/10">
        {renderContract(data.call, 'call')}
      </div>
      <div className="flex items-center justify-center">
        <div className="text-white font-semibold text-sm">
          ₹{data.strikePrice.toFixed(0)}
        </div>
      </div>
      <div className="col-span-3 flex items-center divide-x divide-white/10">
        {renderContract(data.put, 'put')}
      </div>
    </div>
  );
};

const SpotPrice: React.FC<{ value: number; previous: number }> = ({ value, previous }) => {
  const trend = value > previous ? 'up' : value < previous ? 'down' : 'flat';
  const color = trend === 'up' ? 'text-emerald-300' : trend === 'down' ? 'text-red-300' : 'text-white';

  return <span className={`font-semibold ${color}`}>₹{value.toFixed(2)}</span>;
};

const toastQueue: string[] = [];
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

const showToast = (message: string) => {
  toastQueue.push(message);
  if (!toastTimeout) {
    displayNextToast();
  }
};

const displayNextToast = () => {
  if (toastQueue.length === 0) {
    toastTimeout = null;
    return;
  }

  const message = toastQueue.shift();
  const containerId = 'option-chain-toast';
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-black/80 text-white px-4 py-2 rounded-full shadow-lg border border-white/10 animate-fade-in';
  toast.innerText = message ?? '';
  container.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => {
      container?.removeChild(toast);
      displayNextToast();
    }, 200);
  }, 1600);
};

export default OptionChainScreen;
