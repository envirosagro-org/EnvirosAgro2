import { useUiStore } from '../store/uiStore';

export const useAppNavigation = () => {
  const navigate = useUiStore(state => state.navigate);
  const goBack = useUiStore(state => state.goBack);
  const goForward = useUiStore(state => state.goForward);

  return { navigate, goBack, goForward };
};
