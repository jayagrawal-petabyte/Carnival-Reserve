'use client';

import React, { useState } from 'react';
import { NeoButton } from '../../../packages/ui/src/button';
import { NeoCard } from '../../../packages/ui/src/card';

// 17 Official Festival Domains
const DOMAINS = [
  { name: 'Coding & Algo', category: 'Tech', icon: '⚡', color: 'bg-[#FFE600]' },
  { name: 'E-Sports Arena', category: 'Gaming', icon: '🎮', color: 'bg-[#00E5FF]' },
  { name: 'Robotics Wars', category: 'Tech', icon: '🤖', color: 'bg-[#FF007A]' },
  { name: 'Battle of Bands', category: 'Music', icon: '🎸', color: 'bg-[#70FF00]' },
  { name: 'Street Dance', category: 'Arts', icon: '💃', color: 'bg-[#C084FC]' },
  { name: 'Fine Arts', category: 'Arts', icon: '🎨', color: 'bg-[#FF6B35]' },
  { name: 'Mono Act Drama', category: 'Arts', icon: '🎭', color: 'bg-[#FFE600]' },
  { name: 'General Quiz', category: 'Academic', icon: '🧠', color: 'bg-[#00E5FF]' },
  { name: 'Fashion Runway', category: 'Lifestyle', icon: '✨', color: 'bg-[#FF007A]' },
  { name: 'UI/UX Design', category: 'Tech', icon: '✏️', color: 'bg-[#70FF00]' },
  { name: 'Shutterbug Photo', category: 'Arts', icon: '📷', color: 'bg-[#C084FC]' },
  { name: 'Hackathon 24H', category: 'Tech', icon: '💻', color: 'bg-[#FF6B35]' },
  { name: 'VR Immersion', category: 'Tech', icon: '🥽', color: 'bg-[#FFE600]' },
  { name: 'Parliamentary Debate', category: 'Literary', icon: '🎙️', color: 'bg-[#00E5FF]' },
  { name: 'Treasure Hunt', category: 'Adventure', icon: '🗺️', color: 'bg-[#FF007A]' },
  { name: 'Cosplay Showcase', category: 'Arts', icon: '🦊', color: 'bg-[#70FF00]' },
  { name: 'Magefficie Hub', category: 'Market', icon: '🎪', color: 'bg-[#C084FC]' }
];

// Magefficie Inventory Items Tiers 1-4
const INVENTORY_ITEMS = [
  { id: '1', name: 'Pop Art Sticker Pack', tier: 1, price: 150, image: '🏷️', tag: 'Must Have', available: 120, bg: 'bg-[#FFE600]' },
  { id: '2', name: 'Carnival Crunch Snacks', tier: 1, price: 250, image: '🍿', tag: 'Tasty', available: 85, bg: 'bg-[#00E5FF]' },
  { id: '3', name: 'Embroidered Log Notebook', tier: 2, price: 650, image: '📓', tag: 'Limited', available: 45, bg: 'bg-[#C084FC]' },
  { id: '4', name: 'Enamel Champion Badge', tier: 2, price: 550, image: '🏅', tag: 'Popular', available: 60, bg: 'bg-[#70FF00]' },
  { id: '5', name: 'Festival Canvas Tote', tier: 3, price: 1200, image: '🛍️', tag: 'Premium', available: 25, bg: 'bg-[#FF6B35]' },
  { id: '6', name: 'Carnival Snapback Cap', tier: 3, price: 1500, image: '🧢', tag: 'Hot', available: 15, bg: 'bg-[#FFE600]' },
  { id: '7', name: 'Celebrity Concert Hoodie', tier: 4, price: 2500, image: '🧥', tag: 'Auction', available: 2, currentBid: 3100, isAuction: true, bg: 'bg-[#FF007A]' },
  { id: '8', name: 'VIP Pass & Artist Backstage', tier: 4, price: 4000, image: '🎟️', tag: 'Auction', available: 1, currentBid: 5200, isAuction: true, bg: 'bg-[#00E5FF]' },
];

export default function NeoBrutalistApp() {
  const [activeTab, setActiveTab] = useState<'passport' | 'qr' | 'shop' | 'auction' | 'leaderboard'>('passport');
  const [balance, setBalance] = useState<number>(850);
  const [claimedDomains, setClaimedDomains] = useState<Record<string, { winner: boolean; time: string }>>({
    'Coding & Algo': { winner: true, time: '11:30 AM' },
    'General Quiz': { winner: false, time: '01:15 PM' },
    'Hackathon 24H': { winner: false, time: '03:40 PM' },
    'Battle of Bands': { winner: true, time: '04:10 PM' },
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>(3500);
  const [notification, setNotification] = useState<string | null>('🎉 Welcome to Carnival Reserve! 4 Domain Stamps Collected.');

  // Live credit simulation helper
  const handleSimulateCredit = (domainName: string, isWinner: boolean) => {
    const reward = isWinner ? 250 : 50;
    setBalance((prev) => prev + reward);
    setClaimedDomains((prev) => ({
      ...prev,
      [domainName]: { winner: isWinner, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    }));
    setNotification(`⚡ Credited +${reward} Crn from ${domainName} (${isWinner ? 'Winner' : 'Participation'})!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePlaceAuctionBid = (itemTitle: string) => {
    if (bidAmount > balance) {
      alert(`Insufficient balance! Your current Treasury Balance is ${balance} Crn.`);
      return;
    }
    setBalance((prev) => prev - bidAmount);
    setNotification(`🏷️ Bid Hold Placed! Reserved ${bidAmount} Crn on ${itemTitle}.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const totalStampsCount = Object.keys(claimedDomains).length;
  const stampPercentage = Math.round((totalStampsCount / 17) * 100);

  return (
    <div className="bg-grid-paper min-h-screen pb-24 text-black selection:bg-[#FFE600]">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2] border-b-3 border-black px-4 py-3 shadow-[0_4px_0_0_#000]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-lg shadow-[2px_2px_0_0_#000]">
              🎠
            </div>
            <div>
              <h1 className="font-black text-lg uppercase tracking-tight leading-none text-black flex items-center gap-1">
                CARNIVAL <span className="bg-[#FF007A] text-white px-1.5 py-0.5 text-xs rounded border border-black transform -rotate-2 inline-block">RESERVE</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">ID: 21BCE1042 • Sza Patel</p>
            </div>
          </div>

          {/* Treasury Balance Capsule */}
          <div className="bg-[#FFE600] border-3 border-black rounded-2xl px-3 py-1 text-right shadow-[3px_3px_0_0_#000] flex items-center gap-2">
            <div>
              <span className="text-[9px] font-black uppercase text-black block leading-none">Treasury Balance</span>
              <span className="text-lg font-black text-black leading-none">{balance} <span className="text-xs">Crn</span></span>
            </div>
            <span className="text-xl">💰</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5 space-y-5">
        
        {/* Dynamic Alert Banner */}
        {notification && (
          <div className="bg-[#70FF00] border-3 border-black rounded-xl p-3 text-xs font-black uppercase shadow-[4px_4px_0_0_#000] flex items-center justify-between animate-bounce">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="font-bold text-sm">✕</button>
          </div>
        )}

        {/* HERO SPEECH BUBBLE & MASCOT CARD (Inspired by Image 1 & 2) */}
        <div className="relative bg-white border-3 border-black rounded-2xl p-5 shadow-[5px_5px_0_0_#000]">
          <div className="absolute -top-3 right-4 bg-[#FF007A] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000]">
            Live Event Pass ★
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              {/* Pop Mascot Avatar Frame */}
              <div className="w-16 h-16 rounded-2xl bg-[#00E5FF] border-3 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0_0_#000] transform -rotate-3">
                😎
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#FFE600] border-2 border-black rounded-full px-1.5 text-[9px] font-black">
                VIP
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-black uppercase tracking-tight leading-snug">
                Your Mind & <span className="bg-[#FFE600] px-1 border-b-3 border-black">Wallet Matter!</span> ⚡
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Explore 17 domain booths, collect stamps, and bid on Tier 4 drops.
              </p>
            </div>
          </div>

          {/* Emotion & Progress Insight (Inspired by Image 1) */}
          <div className="mt-4 pt-3 border-t-3 border-black flex items-center justify-between bg-[#FAF7F2] rounded-xl p-3 border-2 border-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000]">
                {stampPercentage}%
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">Passport Progress</span>
                <span className="text-xs font-black text-black">{totalStampsCount} / 17 Domains Collected</span>
              </div>
            </div>

            {/* Quick Visual Dots */}
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-black ${
                    i < totalStampsCount ? 'bg-[#FF007A]' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PILL NAVIGATION BADGES (Inspired by Image 1 Self-Care Category Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'passport', label: 'Stamps', icon: '🎫', color: 'bg-[#FFE600]' },
            { id: 'qr', label: 'My QR', icon: '📱', color: 'bg-[#00E5FF]' },
            { id: 'shop', label: 'Market', icon: '🛍️', color: 'bg-[#70FF00]' },
            { id: 'auction', label: 'Auction', icon: '🔨', color: 'bg-[#FF007A]' },
            { id: 'leaderboard', label: 'Ranks', icon: '👑', color: 'bg-[#C084FC]' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-black text-xs uppercase border-3 border-black flex items-center gap-1.5 transition-all whitespace-nowrap shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                activeTab === tab.id
                  ? `${tab.color} text-black border-black scale-105`
                  : 'bg-white text-black hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DIGITAL PASSPORT STAMPS */}
        {activeTab === 'passport' && (
          <div className="space-y-4">
            <NeoCard title="17 Domain Festival Passport" badge={`${totalStampsCount}/17 Claimed`} badgeColor="bg-[#FFE600]">
              
              {/* Search filter input (Inspired by Image 3) */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search domains (e.g. Coding, Quiz, Music)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-3 border-black rounded-xl p-2.5 text-xs font-bold bg-[#FAF7F2] shadow-[3px_3px_0_0_#000] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {DOMAINS.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((domain) => {
                  const stamp = claimedDomains[domain.name];
                  return (
                    <div
                      key={domain.name}
                      className={`border-3 border-black rounded-xl p-3 flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${
                        stamp
                          ? stamp.winner
                            ? 'bg-[#FFE600] shadow-[3px_3px_0_0_#000]'
                            : 'bg-[#00E5FF] shadow-[3px_3px_0_0_#000]'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xl">{domain.icon}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md border border-black bg-white uppercase">
                          {domain.category}
                        </span>
                      </div>

                      <div className="mt-2">
                        <h4 className="font-black text-xs uppercase leading-snug">{domain.name}</h4>
                        {stamp ? (
                          <div className="mt-2 pt-1 border-t-2 border-black flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-black">
                              {stamp.winner ? '🏆 Winner +250' : '✅ Claimed +50'}
                            </span>
                            <span className="text-[8px] font-bold text-slate-700">{stamp.time}</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex gap-1">
                            <button
                              onClick={() => handleSimulateCredit(domain.name, false)}
                              className="w-full text-[9px] font-black uppercase py-1 bg-white hover:bg-slate-100 border-2 border-black rounded-md shadow-[1px_1px_0_0_#000]"
                            >
                              +50 Crn
                            </button>
                            <button
                              onClick={() => handleSimulateCredit(domain.name, true)}
                              className="w-full text-[9px] font-black uppercase py-1 bg-[#FF007A] text-white hover:bg-pink-600 border-2 border-black rounded-md shadow-[1px_1px_0_0_#000]"
                            >
                              +250 Crn
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </NeoCard>
          </div>
        )}

        {/* TAB 2: MY QR CODE PASS (Inspired by Polaroid / Photo Frame in Image 1) */}
        {activeTab === 'qr' && (
          <NeoCard title="Participant Identity Pass" badge="Idempotent Scan" badgeColor="bg-[#00E5FF]">
            <div className="text-center py-2 space-y-4">
              
              {/* Polaroid Card Frame with Washi Tape Accent */}
              <div className="relative inline-block border-3 border-black rounded-2xl p-5 bg-[#FFE600] shadow-[6px_6px_0_0_#000]">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-black text-[9px] font-black uppercase border-2 border-black px-4 py-0.5 rounded-full shadow-[2px_2px_0_0_#000]">
                  DO NOT SHARE SECRET
                </div>

                <div className="bg-white border-3 border-black rounded-xl p-4 mt-2">
                  <svg width="180" height="180" viewBox="0 0 100 100" className="mx-auto">
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />

                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />

                    <rect x="35" y="35" width="10" height="10" fill="black" />
                    <rect x="50" y="35" width="15" height="10" fill="black" />
                    <rect x="35" y="50" width="25" height="15" fill="black" />
                    <rect x="65" y="65" width="15" height="15" fill="black" />
                  </svg>
                </div>

                <div className="mt-3 bg-black text-[#FFE600] font-mono text-xs font-black py-1.5 px-3 rounded-lg border border-black">
                  part_9f83a21e-84b2-4d3f
                </div>
              </div>

              <div className="border-3 border-black bg-white rounded-xl p-3 text-left space-y-1 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-black font-black uppercase">
                  <span>🔒 Security Rule:</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  This QR code encodes ONLY your <code className="font-mono text-black font-black">participant_id</code>. Zero personal or balance data is transmitted inside the code.
                </p>
              </div>
            </div>
          </NeoCard>
        )}

        {/* TAB 3: MAGEFFICIE MARKETPLACE (Inspired by Image 2 Drop Cards) */}
        {(activeTab === 'shop' || activeTab === 'auction') && (
          <div className="space-y-4">
            <div className="border-3 border-black bg-[#FF007A] text-white rounded-2xl p-4 shadow-[5px_5px_0_0_#000] flex items-center justify-between">
              <div>
                <h2 className="font-black text-lg uppercase tracking-tight">Magefficie Drops</h2>
                <p className="text-xs font-bold text-pink-100 uppercase">Tiers 1-3 Instant Buy & Tier 4 Auction Holds</p>
              </div>
              <span className="text-3xl">🛍️</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {INVENTORY_ITEMS.filter((item) => (activeTab === 'auction' ? item.isAuction : !item.isAuction)).map((item) => (
                <div
                  key={item.id}
                  className={`border-3 border-black rounded-2xl p-4 shadow-[5px_5px_0_0_#000] bg-white relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} border-3 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0_0_#000]`}>
                        {item.image}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black bg-[#FFE600]">
                            Tier {item.tier}
                          </span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black bg-slate-100">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="font-black text-sm uppercase text-black mt-1">{item.name}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black block text-black">{item.price} Crn</span>
                      <span className="text-[10px] font-bold text-slate-500 block">{item.available} in stock</span>
                    </div>
                  </div>

                  {item.isAuction ? (
                    <div className="mt-4 pt-3 border-t-3 border-black bg-[#FAF7F2] rounded-xl p-3 border-2">
                      <div className="flex items-center justify-between text-xs font-black mb-2">
                        <span>Current High Bid: <strong className="text-[#FF007A] text-sm">{item.currentBid} Crn</strong></span>
                        <span className="bg-[#FFE600] border border-black px-2 py-0.5 rounded text-[10px]">⏰ Ends 06:00 PM</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          defaultValue={item.currentBid! + 200}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="border-3 border-black rounded-xl px-3 py-1.5 text-xs font-mono font-bold w-full bg-white shadow-[2px_2px_0_0_#000]"
                        />
                        <NeoButton size="sm" variant="pink" pill onClick={() => handlePlaceAuctionBid(item.name)}>
                          PLACE HOLD
                        </NeoButton>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between pt-2 border-t-2 border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Instant Scan-and-Buy at Booth</span>
                      <NeoButton size="sm" variant="cyan" pill onClick={() => alert(`Show your QR code at Magefficie Booth to buy ${item.name} for ${item.price} Crn.`)}>
                        VIEW ITEM &gt;&gt;
                      </NeoButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRIVACY-PRESERVING LEADERBOARD (Inspired by Image 3 List Layout) */}
        {activeTab === 'leaderboard' && (
          <NeoCard title="Carnival Top Rankings" badge="Privacy Guarded" badgeColor="bg-[#C084FC]">
            <p className="text-[11px] font-bold text-slate-600 mb-4 uppercase leading-relaxed">
              🔒 Server Enforced: Raw balances are strictly hidden for all participants other than your own account.
            </p>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: 'Aarav Sharma', reg: '21BCE***', balance: undefined, isSelf: false, avatar: '👑' },
                { rank: 2, name: 'Ananya Verma', reg: '21BIT***', balance: undefined, isSelf: false, avatar: '⭐' },
                { rank: 3, name: 'Sza Patel (You)', reg: '21BCE1042', balance: balance, isSelf: true, avatar: '😎' },
                { rank: 4, name: 'Rohan Mehta', reg: '21BME***', balance: undefined, isSelf: false, avatar: '🚀' },
                { rank: 5, name: 'Priya Nair', reg: '21ECE***', balance: undefined, isSelf: false, avatar: '🎨' },
              ].map((entry) => (
                <div
                  key={entry.rank}
                  className={`border-3 border-black rounded-xl p-3 flex items-center justify-between transition-transform ${
                    entry.isSelf
                      ? 'bg-[#FFE600] font-black shadow-[4px_4px_0_0_#000] scale-[1.02]'
                      : 'bg-white shadow-[2px_2px_0_0_#000]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white font-black text-xs flex items-center justify-center border-2 border-black">
                      #{entry.rank}
                    </div>
                    <span className="text-xl">{entry.avatar}</span>
                    <div>
                      <span className="text-xs font-black uppercase block text-black">{entry.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600">{entry.reg}</span>
                    </div>
                  </div>

                  <div>
                    {entry.isSelf ? (
                      <span className="text-sm font-black text-black bg-white px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0_0_#000]">
                        {entry.balance} Crn
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                        🔒 Hidden
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </NeoCard>
        )}
      </main>
    </div>
  );
}
