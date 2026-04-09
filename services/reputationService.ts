import { ReputationEvent } from '../types';

export const getReputationEvents = (stewardEsin: string): ReputationEvent[] => {
  try {
    // Simulate fetching reputation events
    return [
      { id: 'REP-01', stewardEsin, type: 'PROPOSAL_VOTE', points: 10, timestamp: new Date().toISOString() },
    ];
  } catch (error) {
    console.error(`Error fetching reputation events for steward ${stewardEsin}:`, error);
    throw new Error(`Failed to fetch reputation events for steward ${stewardEsin}`);
  }
};

export const calculateReputation = (events: ReputationEvent[]): number => {
  try {
    // Simulate calculating reputation
    return events.reduce((acc, event) => acc + event.points, 0);
  } catch (error) {
    console.error('Error calculating reputation:', error);
    throw new Error('Failed to calculate reputation');
  }
};

export const getReputationHistory = (stewardEsin: string) => {
  try {
    // Simulate fetching reputation history
    return [
      { month: 'Jan', score: 50 },
      { month: 'Feb', score: 80 },
      { month: 'Mar', score: 120 },
      { month: 'Apr', score: 180 },
    ];
  } catch (error) {
    console.error(`Error fetching reputation history for steward ${stewardEsin}:`, error);
    throw new Error(`Failed to fetch reputation history for steward ${stewardEsin}`);
  }
};
