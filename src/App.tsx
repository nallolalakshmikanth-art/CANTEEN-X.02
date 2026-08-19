/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { Navbar } from './components/Navbar';
import { StaffDashboard } from './components/StaffPortal/StaffDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { LoginScreen } from './components/Auth/LoginScreen';
import { FullscreenTokenTV } from './components/Common/FullscreenTokenTV';
import { StudentMenuPreviewModal } from './components/Common/StudentMenuPreviewModal';

const DashboardContent: React.FC = () => {
  const { currentUser, currentRole } = useCanteen();
  const [isTVOpen, setIsTVOpen] = useState(false);
  const [isMenuPreviewOpen, setIsMenuPreviewOpen] = useState(false);

  // If unauthenticated, show Login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0D0E15] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with Role Switcher & Live Stats */}
      <Navbar 
        onOpenTV={() => setIsTVOpen(true)}
        onOpenMenuPreview={() => setIsMenuPreviewOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {currentRole === 'staff' ? (
          <StaffDashboard onOpenTV={() => setIsTVOpen(true)} />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Waiting Area Fullscreen TV Mode */}
      <FullscreenTokenTV
        isOpen={isTVOpen}
        onClose={() => setIsTVOpen(false)}
      />

      {/* Student Self-Ordering Kiosk Preview */}
      <StudentMenuPreviewModal
        isOpen={isMenuPreviewOpen}
        onClose={() => setIsMenuPreviewOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#26283D] bg-[#161726] py-4 px-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Campus CanteenX Portal &bull; Enterprise Kitchen Operating System
          </p>
          <p className="text-gray-500">
            Connected to Kitchen Bays 1-4 &bull; Student RFID Mesh Enabled
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CanteenProvider>
      <DashboardContent />
    </CanteenProvider>
  );
}
