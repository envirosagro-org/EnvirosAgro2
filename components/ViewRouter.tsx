import { ViewState } from '../types';

export const navigateTo = (view: ViewState, section?: string, replace: boolean = false, params?: any) => {
  // Logic to handle routing, perhaps interacting with the store directly or a custom event bus
  // For now, mirroring the existing navigate function's behavior
  window.history.pushState({ view, section, params }, '', `?view=${view}${section ? `&section=${section}` : ''}${params?.id ? `&id=${params.id}` : ''}`);
  // Dispatch a custom event to notify components of the route change
  window.dispatchEvent(new CustomEvent('routeChange', { detail: { view, section, params } }));
};
