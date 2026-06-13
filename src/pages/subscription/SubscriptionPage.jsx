import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { getCustomer, setupIntent, subscription, cancelSubscription } from '../../api/subscription';
import { getSubscriptionDetails } from '../../api/user';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const benefits = [
  { emoji: '♾️', title: 'Unlimited Daily Expenses', desc: 'Log as many transactions as you need — no daily caps, ever.' },
  { emoji: '📊', title: 'Expense Charts & Analysis', desc: 'Visual breakdowns, trend lines, and smart category insights.' },
  { emoji: '📄', title: 'Monthly & Yearly Reports', desc: 'Downloadable PDF reports to track your financial health over time.' },
  { emoji: '⚡', title: 'Priority Support', desc: 'Get responses within 2 hours, any day of the week.' },
  { emoji: '🚀', title: 'Early Feature Access', desc: 'Be first to try new tools before they roll out to everyone.' },
];

/* ─── Payment Form ───────────────────────────────────────────────── */
function SubscribeForm({ customerId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { setupIntent: intent, error: setupError } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
    });

    if (setupError) {
      setError(setupError.message);
      setLoading(false);
      return;
    }

    try {
      const data = await subscription({ customerId, paymentMethodId: intent.payment_method });
      const { paymentError } = await stripe.confirmCardPayment(data.clientSecret);
      if (paymentError) setError(paymentError.message);
      else onSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }


  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <button onClick={onCancel} style={s.closeBtn}>✕</button>

        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={s.modalIconWrap}>⭐</div>
          <div>
            <h2 style={s.modalTitle}>Complete your subscription</h2>
            <p style={s.modalSub}>Billed monthly · Cancel anytime</p>
          </div>
        </div>

        {/* Price row */}
        <div style={s.modalPriceRow}>
          <span style={s.modalPrice}>₹50</span>
          <span style={s.modalPricePer}>/month</span>
          <span style={s.modalPriceBadge}>PREMIUM</span>
        </div>

        <div style={s.modalDivider} />

        {/* Stripe form */}
        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card']
            }}
          />

          {error && (
            <div style={s.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            style={{ ...s.primaryBtn, opacity: !stripe || loading ? 0.65 : 1, width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {loading ? '⏳ Processing…' : '✓ Activate Premium — ₹50/mo'}
          </button>
        </form>

        <p style={s.secureNote}>🔐 Secured by Stripe · 256-bit encryption</p>
      </div>
    </div>
  );
}

/* ─── Cancel Confirmation Modal ──────────────────────────────────── */
function CancelConfirmModal({ expiresAt, onConfirm, onClose, loading, error }) {
  const date = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <button onClick={onClose} style={s.closeBtn}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ ...s.modalIconWrap, background: '#fef2f2' }}>⚠️</div>
          <div>
            <h2 style={s.modalTitle}>Cancel Premium subscription?</h2>
            <p style={s.modalSub}>This action can be reversed by resubscribing</p>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: '0 0 20px' }}>
          You'll lose access to unlimited expenses, charts &amp; analysis, reports, and priority support
          {date ? <> at the end of your current billing period, on <strong style={{ color: '#1a1a2e' }}>{date}</strong></> : ''}.
          No further charges will be made.
        </p>

        {error && (
          <div style={{ ...s.errorBox, marginBottom: 16 }}>
            <span>⚠</span> {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ ...s.secondaryBtn, flex: 1, justifyContent: 'center', opacity: loading ? 0.65 : 1 }}
          >
            Keep Premium
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ ...s.dangerBtn, flex: 1, justifyContent: 'center', opacity: loading ? 0.65 : 1 }}
          >
            {loading ? '⏳ Cancelling…' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Already Premium ────────────────────────────────────────────── */
function PremiumActive({ expiresAt, onCancelled }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const date = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  async function handleCancel() {
    setCancelLoading(true);
    setCancelError('');
    try {
      await cancelSubscription();
      setShowCancelModal(false);
      onCancelled?.();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel subscription. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div style={s.page}>
      {/* Active banner */}
      <div style={s.premiumBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={s.bannerIconWrap}>⭐</div>
          <div>
            <h2 style={s.bannerTitle}>You're a Premium Member</h2>
            {date && (
              <p style={s.bannerSub}>
                Subscription expires on <strong style={{ color: '#5b4fcf' }}>{date}</strong>
              </p>
            )}
          </div>
        </div>
        <span style={s.activePill}>● Active</span>
      </div>

      <p style={s.enjoyText}>Enjoy all the benefits included in your Premium plan.</p>

      {/* Benefits grid */}
      <div style={s.benefitsGrid}>
        {benefits.map((b) => (
          <div key={b.title} style={s.benefitCard}>
            <div style={s.benefitIconWrap}>{b.emoji}</div>
            <div>
              <p style={s.benefitTitle}>{b.title}</p>
              <p style={s.benefitDesc}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel link */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <button onClick={() => setShowCancelModal(true)} style={s.cancelLink}>
          Cancel subscription
        </button>
      </div>

      {showCancelModal && (
        <CancelConfirmModal
          expiresAt={expiresAt}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelLoading}
          error={cancelError}
        />
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function SubscribePage() {
  const [clientSecret, setClientSecret] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);

  async function loadSubscription() {
    try {
      const subDetails = await getSubscriptionDetails();
      setIsPremium(subDetails.userType === 'PREMIUM');
      setSubscriptionEnd(subDetails.expiryDate);
      return subDetails.userType === 'PREMIUM';
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function setup() {
      const premium = await loadSubscription();
      if (premium) return;

      try {
        const cid = await getCustomer();
        setCustomerId(cid);
        const secret = await setupIntent();
        setClientSecret(secret);
      } finally {
        setLoading(false);
      }
    }
    setup();
  }, []);

  if (isPremium) return <PremiumActive expiresAt={subscriptionEnd} onCancelled={loadSubscription} />;

  if (isSuccess) {
    return (
      <div style={s.page}>
        <div style={{ ...s.premiumBanner, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ ...s.bannerIconWrap, background: '#dcfce7' }}>🎉</div>
            <div>
              <h2 style={{ ...s.bannerTitle, color: '#166534' }}>Welcome to Premium!</h2>
              <p style={{ ...s.bannerSub, color: '#15803d' }}>Your subscription is now active. Enjoy all premium features.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div style={s.pageIconWrap}>⭐</div>
        <div>
          <h1 style={s.pageTitle}>Subscription</h1>
          <p style={s.pageSub}>Unlock the full power of your expense tracker</p>
        </div>
      </div>

      {/* Price card */}
      <div style={s.priceCard}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
          <span style={s.priceCardAmount}>₹50</span>
          <span style={s.priceCardPer}>/month</span>
        </div>
        <p style={s.priceCardNote}>No hidden fees · Cancel anytime · Instant activation</p>
        <button
          style={{ ...s.primaryBtn, opacity: loading || !clientSecret ? 0.65 : 1 }}
          onClick={() => setShowForm(true)}
          disabled={loading || !clientSecret}
        >
          {loading ? 'Setting up…' : '⭐ Get Premium'}
        </button>
      </div>

      {/* What's included */}
      <p style={s.sectionLabel}>WHAT'S INCLUDED</p>
      <div style={s.benefitsGrid}>
        {benefits.map((b) => (
          <div key={b.title} style={s.benefitCard}>
            <div style={s.benefitIconWrap}>{b.emoji}</div>
            <div>
              <p style={s.benefitTitle}>{b.title}</p>
              <p style={s.benefitDesc}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment modal */}
      {showForm && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <SubscribeForm
            customerId={customerId}
            onSuccess={() => { setShowForm(false); setIsSuccess(true); }}
            onCancel={() => setShowForm(false)}
          />
        </Elements>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: '100vh',
    background: '#f7f7f8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#1a1a2e',
    padding: '32px 32px 64px',
    maxWidth: 860,
  },

  /* Page header */
  pageHeader: {
    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28,
  },
  pageIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: '#ede9fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22,
  },
  pageTitle: {
    fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0,
  },
  pageSub: {
    fontSize: 14, color: '#6b7280', margin: 0, marginTop: 2,
  },

  /* Price card */
  priceCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '24px 28px',
    marginBottom: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  priceCardAmount: {
    fontSize: 40, fontWeight: 800, color: '#5b4fcf', lineHeight: 1,
  },
  priceCardPer: {
    fontSize: 16, color: '#9ca3af', fontWeight: 400, marginBottom: 6,
  },
  priceCardNote: {
    fontSize: 13, color: '#9ca3af', margin: 0,
  },

  /* Primary button */
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#5b4fcf',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    letterSpacing: '0.2px',
  },

  /* Secondary button */
  secondaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },

  /* Danger button */
  dangerBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },

  /* Cancel link */
  cancelLink: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 4,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
    color: '#9ca3af', marginBottom: 14,
  },

  /* Benefits grid */
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 12,
  },
  benefitCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  benefitIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    background: '#ede9fb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, flexShrink: 0,
  },
  benefitTitle: {
    fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px',
  },
  benefitDesc: {
    fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5,
  },

  /* Premium active banner */
  premiumBanner: {
    background: '#f5f3ff',
    border: '1px solid #ddd6fe',
    borderRadius: 14,
    padding: '20px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12, marginBottom: 8,
  },
  bannerIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: '#ede9fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  bannerTitle: {
    fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0,
  },
  bannerSub: {
    fontSize: 13, color: '#6b7280', margin: '2px 0 0',
  },
  activePill: {
    background: '#dcfce7', color: '#166534',
    fontSize: 12, fontWeight: 600,
    padding: '4px 12px', borderRadius: 100,
  },
  enjoyText: {
    fontSize: 14, color: '#6b7280', marginBottom: 20, marginTop: 10,
  },

  /* Payment overlay */
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 24,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%', maxWidth: 480,
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    background: '#f3f4f6', border: 'none',
    color: '#6b7280', width: 30, height: 30,
    borderRadius: '50%', cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modalIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: '#ede9fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  modalTitle: {
    fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0,
  },
  modalSub: {
    fontSize: 13, color: '#9ca3af', margin: '2px 0 0',
  },
  modalPriceRow: {
    display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4,
  },
  modalPrice: {
    fontSize: 36, fontWeight: 800, color: '#5b4fcf', lineHeight: 1,
  },
  modalPricePer: {
    fontSize: 14, color: '#9ca3af',
  },
  modalPriceBadge: {
    marginLeft: 'auto',
    background: '#ede9fb', color: '#5b4fcf',
    fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
    padding: '4px 10px', borderRadius: 100,
  },
  modalDivider: {
    height: 1, background: '#f3f4f6', margin: '16px 0',
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: 8,
    padding: '10px 14px', fontSize: 13,
    display: 'flex', gap: 6, alignItems: 'center',
  },
  secureNote: {
    textAlign: 'center', marginTop: 16,
    fontSize: 11, color: '#d1d5db', letterSpacing: '0.3px',
  },
};