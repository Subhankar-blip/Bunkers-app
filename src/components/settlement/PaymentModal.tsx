import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/currency';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Banknote,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  amount: number;
}

type PaymentState = 'initial' | 'processing' | 'success' | 'failed';

const PAYMENT_METHODS = [
  { id: 'upi_gpay', name: 'Google Pay (UPI)', icon: '📱', desc: 'Instant UPI transfer' },
  { id: 'upi_phonepe', name: 'PhonePe (UPI)', icon: '⚡', desc: 'Fast UPI payment' },
  { id: 'upi_paytm', name: 'Paytm UPI', icon: '💳', desc: 'Wallet or UPI' },
  { id: 'card', name: 'Debit / Credit Card', icon: '🏦', desc: 'Visa, Mastercard, RuPay' },
  { id: 'cash', name: 'Cash in Hand', icon: '💵', desc: 'Settled offline in person' },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  receiverAvatar,
  amount,
}) => {
  const { currentUser, processPayment } = useTrip();

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [paymentState, setPaymentState] = useState<PaymentState>('initial');
  const [txnRef, setTxnRef] = useState<string>('');

  const handlePay = async () => {
    setPaymentState('processing');

    const methodObj = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
    const methodName = methodObj ? methodObj.name : 'UPI';

    // Simulate realistic bank gateway authorization delay (1.2s)
    setTimeout(async () => {
      try {
        const tx = await processPayment(receiverId, amount, methodName);
        setTxnRef(tx.transactionReference);
        setPaymentState('success');
      } catch (err) {
        setPaymentState('failed');
      }
    }, 1200);
  };

  const handleFinish = () => {
    setPaymentState('initial');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={paymentState === 'processing' ? () => {} : handleFinish}
      title={paymentState === 'success' ? 'Payment Successful! 🎉' : 'Instant Settle Up 💳'}
      subtitle={
        paymentState === 'success'
          ? 'Your transaction has been confirmed and balances updated'
          : `You are about to pay ${receiverName}`
      }
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Initial / Processing State */}
        {paymentState !== 'success' && (
          <>
            {/* Payment Summary Box */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Amount to Transfer
              </span>
              <div className="text-4xl font-black text-emerald-400 tracking-tight">
                {formatINR(amount)}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    {currentUser.name}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <div className="flex items-center gap-2">
                  <img
                    src={receiverAvatar}
                    alt={receiverName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    {receiverName}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Choose Payment Method
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={paymentState === 'processing'}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div className="text-left">
                          <span className="block font-bold">{method.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {method.desc}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulation Notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Demo Gateway:</strong> Instant simulation will update the group balance and append a transaction record with verified reference ID.
              </span>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                disabled={paymentState === 'processing'}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paymentState === 'processing'}
                onClick={handlePay}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-75 text-white shadow-lg shadow-emerald-600/30 transition-all min-w-[140px]"
              >
                {paymentState === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatINR(amount)}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Success State */}
        {paymentState === 'success' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">
                Payment Complete!
              </h3>
              <p className="text-xs text-slate-300">
                <strong className="text-emerald-400">{formatINR(amount)}</strong> successfully transferred to <strong className="text-white">{receiverName}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-left max-w-sm mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-200">{txnRef}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Updated Debt:</span>
                <span className="font-bold text-slate-200">₹0 Settled</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all"
            >
              Done & Return to Trip
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
