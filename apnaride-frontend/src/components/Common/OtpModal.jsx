import React from 'react';
import BottomSheet from '../ui/BottomSheet';

export default function OtpModal({ open, otp, onChange, onVerify, onResend, onClose, loading, error, phone }) {
    if (!open) return null;

    return (
        <BottomSheet open={open} onClose={onClose} showHandle>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '24px'
                        }}>
                            🔐
                        </div>
                        <h3 style={{
                            margin: 0,
                            fontFamily: "'Space Grotesk', 'Poppins', sans-serif",
                            fontWeight: 700,
                            fontSize: '24px',
                            color: '#1f2937',
                            letterSpacing: '-0.02em'
                        }}>
                            Verify OTP
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '10px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: '#6b7280',
                            transition: 'all 0.2s',
                            fontWeight: 300
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e5e7eb';
                            e.currentTarget.style.color = '#1f2937';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#6b7280';
                        }}
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Phone Info */}
                {phone && (
                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '15px',
                        color: '#6b7280',
                        marginTop: 0,
                        marginBottom: '24px',
                        textAlign: 'center'
                    }}>
                        We've sent a verification code to <strong style={{ color: '#1f2937' }}>{phone}</strong>
                    </p>
                )}

                {/* OTP Input */}
                <div style={{ marginBottom: '24px' }}>
                    <input
                        inputMode="numeric"
                        pattern="\\d*"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        onKeyDown={(e) => {
                            if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight|Delete|Enter/.test(e.key)) {
                                e.preventDefault();
                            }
                            if (e.key === 'Enter' && otp.length === 4) {
                                onVerify();
                            }
                        }}
                        placeholder="••••"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '20px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '16px',
                            fontFamily: "'Space Grotesk', monospace",
                            fontSize: '32px',
                            fontWeight: 600,
                            textAlign: 'center',
                            letterSpacing: '16px',
                            outline: 'none',
                            transition: 'all 0.3s',
                            background: '#f9fafb'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.background = '#fff';
                            e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.background = '#f9fafb';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    {error && (
                        <p style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '14px',
                            color: '#dc2626',
                            marginTop: '12px',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            <span>⚠️</span> {error}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <button
                        onClick={onVerify}
                        disabled={loading || (otp || '').length !== 4}
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            padding: '16px',
                            background: loading || (otp || '').length !== 4
                                ? '#e5e7eb'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: loading || (otp || '').length !== 4 ? '#9ca3af' : '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading || (otp || '').length !== 4 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: loading || (otp || '').length !== 4
                                ? 'none'
                                : '0 4px 15px rgba(102, 126, 234, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && otp.length === 4) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = loading || otp.length !== 4
                                ? 'none'
                                : '0 4px 15px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }}></span>
                                Verifying...
                            </>
                        ) : (
                            <>✓ Verify OTP</>
                        )}
                    </button>
                    <button
                        onClick={onResend}
                        disabled={loading}
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            padding: '14px',
                            background: 'transparent',
                            color: loading ? '#9ca3af' : '#667eea',
                            border: '2px solid',
                            borderColor: loading ? '#e5e7eb' : '#667eea',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.background = '#667eea';
                                e.currentTarget.style.color = '#fff';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = loading ? '#9ca3af' : '#667eea';
                        }}
                    >
                        🔄 Resend Code
                    </button>
                </div>
                <style>{`
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </BottomSheet>
    );
}
