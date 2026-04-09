import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../services/firebaseService';
import { User } from '../types';

export const useMarketplaceProducts = (user: User) => {
  return useQuery({
    queryKey: ['marketplaceProducts', user.esin],
    queryFn: () => getCollection('vendor_products', true),
    staleTime: 60000, // 1 minute
  });
};

export const useMarketplaceAnalytics = () => {
  return useQuery({
    queryKey: ['market_analytics'],
    queryFn: () => getCollection('market_analytics', true),
    staleTime: 300000, // 5 minutes
  });
};

export const useMarketplaceNews = () => {
  return useQuery({
    queryKey: ['market_news'],
    queryFn: () => getCollection('market_news', true),
    staleTime: 300000, // 5 minutes
  });
};
