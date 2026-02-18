
import { AgroBlock, AgroTransaction } from '../types';
import { saveCollectionItem } from './firebaseService';
import { validateProofOfSustainability } from './geminiService';

export const generateHash = async (data: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(data + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32).toUpperCase();
};

export const createGenesisBlock = async (): Promise<AgroBlock> => {
  const genesis: AgroBlock = {
    hash: '0x0000_GENESIS_SYCAMORE_ROOT',
    prevHash: '0x0000_VOID',
    timestamp: new Date().toISOString(),
    transactions: [{
      id: 'TX-GENESIS',
      type: 'TokenzMint',
      farmId: 'CORE-HQ',
      details: 'EnvirosAgro Network Genesis Sequence',
      value: 1000000,
      unit: 'EAC'
    }],
    validator: 'EA-ORACLE-01',
    status: 'Confirmed'
  };
  await saveCollectionItem('blocks', genesis);
  return genesis;
};

export const mineBlockWithValidator = async (prevBlock: AgroBlock, mempool: AgroTransaction[], validator: string, evidence?: any): Promise<AgroBlock> => {
  let validatorJustification = "Consensus reached via automated node quorum.";
  
  if (evidence) {
    const audit = await validateProofOfSustainability({
      description: `Validating transaction batch for node ${validator}. Evidence provided for ${mempool.length} shards.`,
      image: evidence.image
    });
    if (audit.json?.justification_shard) {
      validatorJustification = audit.json.justification_shard;
    }
  }

  const hashData = prevBlock.hash + JSON.stringify(mempool) + validator + validatorJustification;
  const hash = await generateHash(hashData);
  
  const block: AgroBlock = {
    hash,
    prevHash: prevBlock.hash,
    timestamp: new Date().toISOString(),
    transactions: [...mempool],
    validator,
    status: 'Confirmed',
    // Storing justification shard in a flexible metadata field or transaction detail extension
  };

  await saveCollectionItem('blocks', block);
  return block;
};
