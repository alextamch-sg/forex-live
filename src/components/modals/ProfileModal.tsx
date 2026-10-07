import React from 'react';
import { X, ShieldCheck, Building2, User, Check, Key } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#CBD5E1] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFCFF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#0A2540]">
                Institutional Entity Credentials
              </h3>
              <p className="text-[11px] text-[#64748B]">MAS Regulatory Tier-1 Licensed Entity</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0A2540] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Entity Summary Card */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
              <img
                src="/src/assets/images/avatar_executive_user_1791359371229.jpg"
                alt="Authorized Representative"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[#0A2540]">
                Temasek Straits Ltd
              </h4>
              <p className="text-xs text-[#64748B]">Managing Director: Meng Kwang</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[11px] bg-[#E8F8F0] text-[#00875A] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  MAS KYC Verified
                </span>
                <span className="font-mono text-[11px] text-[#64748B]">UEN: 201948210D</span>
              </div>
            </div>
          </div>

          {/* Institutional Specs */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Registered Office:</span>
              <span className="font-medium text-[#0A2540] text-right">
                1 Marina Boulevard, #28-01, One Marina Bay, Singapore 018989
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">MAS MEPS+ Identifier:</span>
              <span className="font-mono font-bold text-[#0052FF]">MEPS-TS-8841-SG</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Aggregate 24h FAST Quota:</span>
              <span className="font-mono font-bold text-[#00875A]">S$ 8,500,000.00</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Designated Primary Custody:</span>
              <span className="font-medium text-[#0A2540]">DBS Bank Institutional Trust</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-[#64748B]">Two-Factor Authorization:</span>
              <span className="font-mono text-[#00875A] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Hardware FIDO2 Active
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Close Entity Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
