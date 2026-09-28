import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 animate-bounce-short ${
                            t.type === 'success'
                                ? 'bg-neutral-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                                : t.type === 'error'
                                ? 'bg-neutral-900/95 border-red-500/50 text-red-300 shadow-red-950/40'
                                : t.type === 'warning'
                                ? 'bg-neutral-900/95 border-amber-500/50 text-amber-300 shadow-amber-950/40'
                                : 'bg-neutral-900/95 border-blue-500/50 text-blue-300 shadow-blue-950/40'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-lg">
                                {t.type === 'success' && '✓'}
                                {t.type === 'error' && '✕'}
                                {t.type === 'warning' && '⚠️'}
                                {t.type === 'info' && 'ℹ️'}
                            </span>
                            <span className="leading-snug">{t.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-white/10"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
