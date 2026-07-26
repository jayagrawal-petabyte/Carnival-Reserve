'use client';

import React, { useState } from 'react';
import { NeoButton } from '../../../packages/ui/src/button';
import { NeoCard } from '../../../packages/ui/src/card';
import { calculateEconomyPools, checkInventoryReconciliation } from '../../../packages/utils/src/index';

export default function AdminDashboard() {
  const [confirmedRegistrations, setConfirmedRegistrations] = useState<number>(1042);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState<boolean>(false);
  const [economySummary, setEconomySummary] = useState<any>(null);
  
  // Pending Devices awaiting Admin Approval
  const [pendingDevices, setPendingDevices] = useState([
    { id: 'dev_01', managerName: 'Rahul Verma (Coding Domain)', deviceName: 'iPhone 14 Pro', fingerprint: 'fp_a982f1', requestedAt: '10:42 AM' },
    { id: 'dev_02', managerName: 'Sneha Patel (Magefficie Vendor)', deviceName: 'Samsung S23', fingerprint: 'fp_b391e2', requestedAt: '11:15 AM' },
  ]);

  // Inventory Reconciliation Items
  const [inventoryItems, setInventoryItems] = useState([
    { id: '1', name: 'Carnival Sticker Pack', tier: 1, openingCount: 200, soldCount: 80, availableCount: 120, reservedCount: 0 },
    { id: '2', name: 'Festival Snack Combo', tier: 1, openingCount: 150, soldCount: 65, availableCount: 85, reservedCount: 0 },
    { id: '3', name: 'Embroidered Notebook', tier: 2, openingCount: 100, soldCount: 55, availableCount: 45, reservedCount: 0 },
    // INTENTIONAL MISMATCH DISCREPANCY FOR AUDIT DEMONSTRATION
    { id: '4', name: 'Carnival Snapback Cap (Audit Flag)', tier: 3, openingCount: 50, soldCount: 30, availableCount: 15, reservedCount: 0 },
  ]);

  const reconciliationReport = checkInventoryReconciliation(inventoryItems);

  // Trigger Registration Close & Dynamic Economy Seeding
  const handleTriggerEconomySeed = () => {
    const summary = calculateEconomyPools(confirmedRegistrations);
    setEconomySummary(summary);
    setIsRegistrationClosed(true);
  };

  const handleApproveDevice = (deviceId: string) => {
    setPendingDevices(pendingDevices.filter((d) => d.id !== deviceId));
    alert(`Device ID ${deviceId} approved for manager access.`);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6 bg-[#F4F0EA] min-h-screen">
      {/* Top Banner */}
      <header className="border-4 border-black bg-[#FFE600] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase text-black">SUPER ADMIN CONTROL PANEL</h1>
          <p className="text-sm font-bold text-black uppercase">Carnival Reserve • Global Audit & Governance</p>
        </div>
        <div className="flex gap-3">
          <NeoButton variant="pink" size="sm">
            FORCE LOGOUT ALL MANAGERS
          </NeoButton>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: REGISTRATION CLOSE & ECONOMY CALCULATOR */}
        <NeoCard title="Dynamic Economy Engine" badge={isRegistrationClosed ? 'SEEDED' : 'OPEN'} bg="bg-white">
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-700">
              Run this calculation ONCE at registration close. Calculates dynamic pools based on confirmed registrations N.
            </p>

            <div className="flex gap-3 items-center">
              <div className="w-full">
                <label className="text-xs font-black uppercase block mb-1">Confirmed Registrations (N)</label>
                <input
                  type="number"
                  value={confirmedRegistrations}
                  onChange={(e) => setConfirmedRegistrations(Number(e.target.value))}
                  disabled={isRegistrationClosed}
                  className="border-4 border-black p-2 font-mono font-bold w-full bg-slate-50"
                />
              </div>
              <div className="pt-5">
                <NeoButton
                  variant="yellow"
                  onClick={handleTriggerEconomySeed}
                  disabled={isRegistrationClosed}
                >
                  {isRegistrationClosed ? 'SEED COMPLETE' : 'CLOSE & SEED'}
                </NeoButton>
              </div>
            </div>

            {economySummary && (
              <div className="border-4 border-black bg-[#00E5FF] p-4 text-xs font-mono space-y-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black text-sm uppercase text-black border-b-2 border-black pb-1 mb-2">
                  Calculated Pools Summary (N = {economySummary.N})
                </div>
                <div>Registration Pool Total: <strong>{economySummary.registrationPoolTotal.toLocaleString()} Crn</strong> ({economySummary.N} × 50)</div>
                <div>Participation Pool / Domain: <strong>{economySummary.participationPoolPerDomain.toLocaleString()} Crn</strong> (Ceiling {economySummary.N} × 50)</div>
                <div>Winner Pool / Domain: <strong>{economySummary.winnerPoolPerDomain.toLocaleString()} Crn</strong> (16 × 250)</div>
                <div>Total Treasury Seed per Domain: <strong>{economySummary.totalDomainTreasurySeed.toLocaleString()} Crn</strong></div>
              </div>
            )}
          </div>
        </NeoCard>

        {/* SECTION 2: DEVICE APPROVAL PANEL (Max 2 rule) */}
        <NeoCard title="Device Approval Panel" badge={`${pendingDevices.length} Pending`} bg="bg-white">
          <p className="text-xs font-bold text-slate-700 mb-3">
            Managers are restricted to max 2 approved devices. Third device logins require Super Admin explicit approval.
          </p>

          {pendingDevices.length === 0 ? (
            <div className="border-2 border-dashed border-black p-4 text-center text-xs font-bold text-slate-500 uppercase">
              No pending device approval requests.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDevices.map((device) => (
                <div key={device.id} className="border-4 border-black p-3 bg-amber-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-xs uppercase text-black">{device.managerName}</h5>
                    <p className="text-[10px] font-bold font-mono text-slate-600">
                      {device.deviceName} • {device.fingerprint}
                    </p>
                  </div>
                  <NeoButton variant="lime" size="sm" onClick={() => handleApproveDevice(device.id)}>
                    APPROVE 3RD
                  </NeoButton>
                </div>
              ))}
            </div>
          )}
        </NeoCard>

        {/* SECTION 3: AUTOMATED INVENTORY RECONCILIATION */}
        <NeoCard title="Automated Inventory Reconciliation" badge="Real-time Audit" bg="bg-white" className="md:col-span-2">
          <p className="text-xs font-bold text-slate-700 mb-4">
            Automated check: Closing Count (Available + Reserved) MUST equal Opening minus Sold. Mismatches are automatically flagged in red.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-4 border-black text-left text-xs">
              <thead className="bg-[#FFE600] border-b-4 border-black font-black uppercase text-black">
                <tr>
                  <th className="p-2 border-r-2 border-black">Item Name</th>
                  <th className="p-2 border-r-2 border-black">Tier</th>
                  <th className="p-2 border-r-2 border-black">Opening</th>
                  <th className="p-2 border-r-2 border-black">Sold</th>
                  <th className="p-2 border-r-2 border-black">Available</th>
                  <th className="p-2 border-r-2 border-black">Expected</th>
                  <th className="p-2 border-r-2 border-black">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="font-mono divide-y-2 divide-black">
                {reconciliationReport.map((item) => (
                  <tr key={item.itemId} className={!item.isReconciled ? 'bg-red-100 font-bold' : 'bg-white'}>
                    <td className="p-2 border-r-2 border-black font-sans font-bold">{item.name}</td>
                    <td className="p-2 border-r-2 border-black">Tier {item.tier}</td>
                    <td className="p-2 border-r-2 border-black">{item.openingCount}</td>
                    <td className="p-2 border-r-2 border-black">{item.soldCount}</td>
                    <td className="p-2 border-r-2 border-black">{item.availableCount}</td>
                    <td className="p-2 border-r-2 border-black">{item.expectedAvailable}</td>
                    <td className="p-2 border-r-2 border-black">
                      {item.isReconciled ? (
                        <span className="bg-[#70FF00] border border-black px-2 py-0.5 text-[10px] font-black uppercase text-black">
                          MATCHED
                        </span>
                      ) : (
                        <span className="bg-[#FF007A] text-white border border-black px-2 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          MISMATCH ({item.discrepancy})
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {!item.isReconciled && (
                        <NeoButton size="sm" variant="pink">
                          FLAG DISCREPANCY
                        </NeoButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeoCard>
      </div>
    </main>
  );
}
