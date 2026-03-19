import CryptoJS from 'crypto-js';
import { AgroBlock, AgroTransaction, MempoolTransaction } from '../types';
import { db, rtdb, auth } from '../src/firebase';
import { 
  collection, 
  doc, 
  runTransaction, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { ref, push, remove, onValue, set } from 'firebase/database';

/**
 * ENVIROSAGRO BLOCKCHAIN SERVICE (V2)
 * Client-side hashing, verification, and atomic writes.
 */

export const calculateHash = (block: Partial<AgroBlock>): string => {
  const { index, timestamp, transactions, previousHash } = block;
  const dataString = `${index}${timestamp}${JSON.stringify(transactions)}${previousHash}`;
  return CryptoJS.SHA256(dataString).toString();
};

export const createGenesisBlock = async (): Promise<AgroBlock> => {
  const genesis: AgroBlock = {
    index: 0,
    timestamp: new Date().toISOString(),
    transactions: [{
      id: 'TX-GENESIS',
      type: 'TokenzMint',
      farmId: 'CORE-HQ',
      details: 'EnvirosAgro Network Genesis Sequence',
      value: 1000000,
      unit: 'EAC'
    }],
    previousHash: '0x0000_VOID',
    hash: '',
    validator: 'EA-ORACLE-01',
    status: 'Confirmed'
  };

  genesis.hash = calculateHash(genesis);
  
  // Use setDoc for genesis if it doesn't exist
  const genesisRef = doc(db, 'blocks', '0');
  await setDoc(genesisRef, genesis);
  return genesis;
};

/**
 * ATOMIC MINING: Prevents chain forks by using Firestore Transactions.
 * Ensures only one block is added for a specific index at a time.
 */
export const mineBlock = async (transactions: AgroTransaction[], validator: string): Promise<AgroBlock | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Authentication required for mining.");

  try {
    return await runTransaction(db, async (transaction) => {
      // 1. Get the latest block to find the next index and previous hash
      const blocksQuery = query(collection(db, 'blocks'), orderBy('index', 'desc'), limit(1));
      const latestBlockSnap = await getDocs(blocksQuery);
      
      let nextIndex = 0;
      let prevHash = '0x0000_VOID';

      if (!latestBlockSnap.empty) {
        const latestBlock = latestBlockSnap.docs[0].data() as AgroBlock;
        nextIndex = latestBlock.index + 1;
        prevHash = latestBlock.hash;
      }

      // 2. Prepare the new block
      const newBlock: AgroBlock = {
        index: nextIndex,
        timestamp: new Date().toISOString(),
        transactions,
        previousHash: prevHash,
        hash: '',
        validator,
        status: 'Confirmed'
      };

      newBlock.hash = calculateHash(newBlock);

      // 3. Write the block to Firestore (Atomic)
      const blockRef = doc(db, 'blocks', nextIndex.toString());
      transaction.set(blockRef, newBlock);

      return newBlock;
    });
  } catch (error) {
    console.error("Mining failed (Transaction Conflict):", error);
    return null;
  }
};

/**
 * CHAIN VERIFICATION: Verifies integrity by checking hashes.
 */
export const verifyChain = async (): Promise<boolean> => {
  try {
    const blocksQuery = query(collection(db, 'blocks'), orderBy('index', 'asc'));
    const snap = await getDocs(blocksQuery);
    const chain = snap.docs.map(d => d.data() as AgroBlock);

    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const prevBlock = chain[i - 1];

      // Verify previous hash reference
      if (currentBlock.previousHash !== prevBlock.hash) {
        console.error(`Chain broken at index ${i}: previousHash mismatch.`);
        return false;
      }

      // Verify current block hash
      const recalculatedHash = calculateHash(currentBlock);
      if (currentBlock.hash !== recalculatedHash) {
        console.error(`Chain broken at index ${i}: hash corruption.`);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};

/**
 * MEMPOOL (RTDB): High-frequency unconfirmed transactions.
 */
export const addToMempool = async (transaction: AgroTransaction) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const mempoolRef = ref(rtdb, 'mempool');
  const newTxRef = push(mempoolRef);
  await set(newTxRef, {
    id: newTxRef.key,
    data: transaction,
    timestamp: new Date().toISOString(),
    stewardId: userId
  });
};

export const clearMempool = async () => {
  const mempoolRef = ref(rtdb, 'mempool');
  await remove(mempoolRef);
};

export const VALIDATORS = [
  'Environmental_Validator_04',
  'Societal_Consensus_Node_82',
  'Technological_Auth_Shard_12',
  'Human_Wellness_Relay_01',
  'Industrial_Core_Finalizer'
];
