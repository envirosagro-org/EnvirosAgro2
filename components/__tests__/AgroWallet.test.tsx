import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgroWallet from '../AgroWallet';
import React from 'react';

const mockUser = {
  name: 'Test Steward',
  email: 'test@envirosagro.org',
  esin: 'EA-TEST-882',
  wallet: {
    balance: 1000,
    eatBalance: 500,
    exchangeRate: 1.5,
    stakedEat: 0,
    stakes: [],
    tier: 'Seed',
    lifetimeEarned: 1000,
    linkedProviders: []
  }
};

const defaultProps = {
  user: mockUser as any,
  isGuest: false,
  onNavigate: vi.fn(),
  onUpdateUser: vi.fn(),
  onSwap: vi.fn(),
  onStake: vi.fn(),
  onEarnEAC: vi.fn(),
  notify: vi.fn(),
  costAudit: null
};

describe('AgroWallet Component', () => {
  it('renders wallet balances correctly', () => {
    render(<AgroWallet {...defaultProps} />);

    expect(screen.getAllByText('1,000').length).toBeGreaterThan(0);
  });

  it('switches tabs correctly', async () => {
    render(<AgroWallet {...defaultProps} />);

    const stakingTab = screen.getByText('Stakes');
    fireEvent.click(stakingTab);
    
    expect(screen.getByText(/Total Staked/i)).toBeDefined();
  });

  it('calls onSwap when execute swap is clicked', async () => {
    const onSwap = vi.fn().mockResolvedValue(true);
    render(<AgroWallet {...defaultProps} onSwap={onSwap} initialSection="swap" />);

    const swapButton = screen.getByText('INITIALIZE SHARD CONVERSION');
    fireEvent.click(swapButton);
    
    await waitFor(() => expect(onSwap).toHaveBeenCalled());
  });
});
