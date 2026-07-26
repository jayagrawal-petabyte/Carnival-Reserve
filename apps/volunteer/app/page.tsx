'use client';

import React, { useState, useEffect } from 'react';
import { NeoButton } from '../../../packages/ui/src/button';
import { NeoCard } from '../../../packages/ui/src/card';

interface QueuedScan {
  idempotencyKey: string;
  participantId: string;
  domainName?: string;
  isWinner?: boolean;
  itemId?: string;
  proofPhotoUrl?: string;
  timestamp: string;
}

export default function VolunteerScannerPanel() {
  const [managerRole, setManagerRole] = useState<'TREASURY' | 'MAGEFFICIE'>('TREASURY');
  const [selectedDomain, setSelectedDomain] = useState<string>('Coding & Algo');
  const [isWinnerCredit, setIsWinnerCredit] = useState<boolean>(false);
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80');
  const [scannedParticipantId, setScannedParticipantId] = useState<string>('part_9f83a21e-84b2-4d3f');

  // Offline queue state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<QueuedScan[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process single scan through 5-step Universal Engine or Queue if Offline
  const handleExecuteScan = () => {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (isWinnerCredit && !proofPhotoUrl) {
      setStatusMsg({ type: 'error', text: 'Winner credits require a mandatory photo proof URL!' });
      return;
    }

    const payload: QueuedScan = {
      idempotencyKey,
      participantId: scannedParticipantId,
      domainName: selectedDomain,
      isWinner: isWinnerCredit,
      proofPhotoUrl: isWinnerCredit ? proofPhotoUrl : undefined,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!isOnline) {
      // Offline fallback: Queue scan locally with idempotency key
      setOfflineQueue((prev) => [...prev, payload]);
      setStatusMsg({
        type: 'success',
        text: `Offline Mode Active: Scan queued locally with Idempotency Key [${idempotencyKey.substring(0, 14)}...]`,
      });
      return;
    }

    // Online execution simulation
    setStatusMsg({
      type: 'success',
      text: `Success! Credited ${isWinnerCredit ? '250 Crn (Winner)' : '50 Crn (Participation)'} to Participant ID ${scannedParticipantId}.`,
    });
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    alert(`Syncing ${offlineQueue.length} queued scans in FIFO order with server idempotency check...`);
    setOfflineQueue([]);
    setStatusMsg({ type: 'success', text: 'All offline queued scans synced successfully!' });
  };

  return (
    <main className="max-w-md mx-auto min-h-screen p-4 bg-[#F4F0EA]">
      {/* Header */}
      <header className="border-4 border-black bg-[#00E5FF] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase text-black">SCANNER PANEL</h1>
            <p className="text-xs font-bold text-black uppercase">Approved Device #1 • Volunteer</p>
          </div>
          <div className="text-right">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                isOnline ? 'bg-[#70FF00] text-black' : 'bg-[#FF007A] text-white'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Offline Queue Sync Bar */}
      {offlineQueue.length > 0 && (
        <div className="border-4 border-black bg-[#FFE600] p-3 mb-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-black uppercase text-black">
            {offlineQueue.length} Scans Queued Offline
          </span>
          <NeoButton size="sm" variant="black" onClick={handleSyncOfflineQueue} disabled={!isOnline}>
            SYNC QUEUE
          </NeoButton>
        </div>
      )}

      {/* Status Alert */}
      {statusMsg && (
        <div
          className={`border-4 border-black p-3 mb-4 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            statusMsg.type === 'success' ? 'bg-[#70FF00] text-black' : 'bg-[#FF007A] text-white'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Manager Role Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setManagerRole('TREASURY')}
          className={`border-4 border-black py-2 text-xs font-black uppercase ${
            managerRole === 'TREASURY' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
          }`}
        >
          Treasury Manager
        </button>
        <button
          onClick={() => setManagerRole('MAGEFFICIE')}
          className={`border-4 border-black py-2 text-xs font-black uppercase ${
            managerRole === 'MAGEFFICIE' ? 'bg-[#FF007A] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
          }`}
        >
          Magefficie Vendor
        </button>
      </div>

      {/* Main Scanner Section */}
      <NeoCard title={managerRole === 'TREASURY' ? 'Domain Credit Scanner' : 'Marketplace Vendor Scan'} badge="Universal 5-Step" bg="bg-white">
        <div className="space-y-4">
          
          {/* Simulated QR Viewfinder */}
          <div className="border-4 border-black bg-black p-6 text-center text-white space-y-2 relative">
            <div className="w-48 h-48 mx-auto border-4 border-dashed border-[#FFE600] flex items-center justify-center bg-slate-900">
              <span className="text-xs font-mono text-[#FFE600] uppercase font-bold animate-pulse">
                [ CAMERA VIEW FINDER ]
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">Position Participant QR Code in Frame</p>
          </div>

          {/* Target Scanned Participant ID */}
          <div>
            <label className="text-xs font-black uppercase block mb-1">Scanned Participant ID</label>
            <input
              type="text"
              value={scannedParticipantId}
              onChange={(e) => setScannedParticipantId(e.target.value)}
              className="border-4 border-black p-2 text-xs font-mono font-bold w-full bg-slate-50"
            />
          </div>

          {/* Treasury Manager Domain Options */}
          {managerRole === 'TREASURY' && (
            <>
              <div>
                <label className="text-xs font-black uppercase block mb-1">Domain Treasury</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="border-4 border-black p-2 text-xs font-bold w-full bg-white"
                >
                  <option value="Coding & Algo">Coding & Algo (Winner Slots: 15/16)</option>
                  <option value="General Quiz">General Quiz (Winner Slots: 16/16)</option>
                  <option value="Hackathon 24H">Hackathon 24H (Winner Slots: 12/16)</option>
                </select>
              </div>

              <div className="border-2 border-black p-3 bg-slate-100 flex items-center justify-between">
                <span className="text-xs font-black uppercase">Credit Type</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsWinnerCredit(false)}
                    className={`px-3 py-1 text-xs font-black border-2 border-black uppercase ${
                      !isWinnerCredit ? 'bg-[#00E5FF] text-black' : 'bg-white'
                    }`}
                  >
                    Participation (+50)
                  </button>
                  <button
                    onClick={() => setIsWinnerCredit(true)}
                    className={`px-3 py-1 text-xs font-black border-2 border-black uppercase ${
                      isWinnerCredit ? 'bg-[#FFE600] text-black' : 'bg-white'
                    }`}
                  >
                    Winner (+250)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Proof Photo Upload (Mandatory for Winner & Purchase) */}
          {(isWinnerCredit || managerRole === 'MAGEFFICIE') && (
            <div className="border-2 border-dashed border-black p-3 bg-pink-50">
              <label className="text-xs font-black uppercase text-pink-700 block mb-1">
                📸 Proof Photo URL (Required for Winner / Purchase)
              </label>
              <input
                type="text"
                value={proofPhotoUrl}
                onChange={(e) => setProofPhotoUrl(e.target.value)}
                className="border-2 border-black p-1.5 text-[11px] font-mono w-full bg-white"
              />
            </div>
          )}

          {/* Action Trigger */}
          <NeoButton variant="yellow" size="lg" className="w-full" onClick={handleExecuteScan}>
            EXECUTE 5-STEP TRANSACTION
          </NeoButton>
        </div>
      </NeoCard>
    </main>
  );
}
