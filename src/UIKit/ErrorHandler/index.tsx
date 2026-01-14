import { ReactNode } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ErrorStateView } from './components/ErrorStateView';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

type ErrorType = ErrorTypeEnum | null;

interface IProps {
  error: ErrorType;
  onRetry: () => void;
  children: ReactNode;
  isLoading?: boolean;
}

export const WithErrorHandler = ({ error, onRetry, children, isLoading = false}: IProps) => {
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify().stiffness(180).damping(16)}
      style={{ flex: 1 }}
    >
      {error ? <ErrorStateView type={error} onRetry={onRetry} isLoading={isLoading}/> : <>{children}</>}
    </Animated.View>
  );
};
