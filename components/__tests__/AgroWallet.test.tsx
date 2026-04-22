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

describe('AgroWallet Component', () => {
  it('renders wallet balances correctly', () => {
    render(
      <AgroWallet 
        user={mockUser as any} 
        isGuest={false} 
        onNavigate={vi.fn()} 
        onUpdateUser={vi.fn()}
        onSwap={vi.fn()}
        onStake={vi.fn()}
        onEarnEAC={vi.fn()}
        notify={vi.fn()}
        costAudit={null}
      />
    );

    expect(screen.getByText('1000.00')).toBeDefined();
    expect(screen.getByText('500.00')).toBeDefined();
  });

  it('switches tabs correctly', async () => {
    render(
      <AgroWallet 
        user={mockUser as any} 
        isGuest={false} 
        onNavigate={vi.fn()} 
        onUpdateUser={vi.fn()}
        onSwap={vi.fn()}
        onStake={vi.fn()}
        onEarnEAC={vi.fn()}
        notify={vi.fn()}
        costAudit={null}
      />
    );

    const stakingTab = screen.getByText('Staking');
    fireEvent.click(stakingTab);
    
    expect(screen.getByText('Stake Finality')).toBeDefined();
  });

  it('calls onSwap when execute swap is clicked', async () => {
    const onSwap = vi.fn().mockResolvedValue(true);
    render(
      <AgroWallet 
        user={mockUser as any} 
        isGuest={false} 
        onNavigate={vi.fn()} 
        onUpdateUser={vi.fn()}
        onSwap={onSwap}
        onStake={vi.fn()}
        onEarnEAC={vi.fn()}
        notify={vi.fn()}
        costAudit={null}
        initialSection="swap"
      />
    );

    const swapButton = screen.getByText('INITIATE SHARD SWAP');
    fireEvent.click(swapButton);
    
    await waitFor(() => expect(onSwap).toHaveBeenCalled());
  });
});
