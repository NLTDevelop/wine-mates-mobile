import { useCallback, useSyncExternalStore } from 'react';

const DEFAULT_DURATION = 59;

type TimerState = {
    isActive: boolean;
    remaining: number;
};

let timerState: TimerState = {
    isActive: false,
    remaining: 0,
};

let intervalId: ReturnType<typeof setInterval> | null = null;
let startedAt: number | null = null;
let duration = DEFAULT_DURATION;

const listeners = new Set<() => void>();

const emit = () => {
    listeners.forEach(listener => listener());
};

const updateState = (partial: Partial<TimerState>) => {
    timerState = {
        ...timerState,
        ...partial,
    };
    emit();
};

const stopInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

const handleTick = () => {
    if (!timerState.isActive || startedAt === null) return;

    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const nextRemaining = Math.max(duration - elapsedSeconds, 0);

    if (nextRemaining !== timerState.remaining) {
        updateState({ remaining: nextRemaining });
    }

    if (nextRemaining === 0) {
        stopOtpTimer();
    }
};

const ensureInterval = () => {
    if (intervalId === null) {
        intervalId = setInterval(handleTick, 1000);
    }
};

export const startOtpTimer = (seconds: number = DEFAULT_DURATION) => {
    duration = seconds;
    startedAt = Date.now();
    updateState({
        isActive: true,
        remaining: seconds,
    });
    ensureInterval();
};

export const stopOtpTimer = () => {
    startedAt = null;
    duration = DEFAULT_DURATION;
    stopInterval();
    updateState({
        isActive: false,
        remaining: 0,
    });
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => timerState;

export const useOTPTimer = () => {
    const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const start = useCallback((seconds?: number) => {
        startOtpTimer(seconds);
    }, []);

    const stop = useCallback(() => {
        stopOtpTimer();
    }, []);

    return { ...state, start, stop };
};
