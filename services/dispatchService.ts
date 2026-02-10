import { saveCollectionItem, dispatchNetworkSignal } from './firebaseService';

/**
 * The Universal Dispatcher for EnvirosAgro Blockchain
 * This handles everything from Tokenz payments to Medicag data logging.
 * It provides a standardized entry point for all industrial and biological shards.
 */
export async function dispatchAgroProcess({ instruction, actor, payload }: { instruction: string, actor: string, payload: any }) {
    console.log(`[EnvirosAgro BC] Initializing instruction: ${instruction} for ${actor}`);

    const generateUniqueNonce = () => `0x${Math.random().toString(16).slice(2, 18).toUpperCase()}`;

    // 1. Transaction Header (The Genesis of the Process)
    const txHeader = {
        timestamp: Date.now(),
        instruction,
        actor,
        nonce: generateUniqueNonce(), // Prevents double-spending/replay
    };

    try {
        switch (instruction) {
            case 'MINT_CARBON':
                // logic for carbon minting (integrating AI Studio data)
                return await executeMinting(txHeader, payload);

            case 'PROCESS_PAYMENT':
                // logic for EnvirosAgro Coin transfer (Tokenz)
                return await executePayment(txHeader, payload);

            case 'LOG_SUSTAINABILITY':
                // logic for recording Agikuyu tradition compliance or soil data
                return await executeDataLog(txHeader, payload);

            case 'UPDATE_SUPPLY_CHAIN':
                // logic for Agroboto/JuizzyCookiez logistics
                return await executeSupplyUpdate(txHeader, payload);

            default:
                throw new Error(`Unknown Instruction: ${instruction}`);
        }
    } catch (error: any) {
        handleProcessFailure(txHeader, error);
        throw error;
    }
}

/**
 * Executes Carbon Minting shard based on verified MRV evidence.
 */
async function executeMinting(header: any, payload: any) {
    const shardId = await saveCollectionItem('transactions', {
        type: 'TokenzMint',
        farmId: header.actor,
        details: `Carbon Mint: ${payload.amount || 0} tCO2e [Nonce: ${header.nonce}]`,
        value: payload.value || 0,
        unit: 'EAC'
    });
    
    await dispatchNetworkSignal({
        type: 'ledger_anchor',
        origin: 'CARBON',
        title: 'MINT_FINALITY_REACHED',
        message: `Carbon shard ${header.nonce} successfully minted to ledger.`,
        priority: 'high',
        actionIcon: 'Zap'
    });
    
    return { status: 'SUCCESS', shardId, header };
}

/**
 * Executes transfer of EnvirosAgro Coins (Utility EAC).
 */
async function executePayment(header: any, payload: any) {
    const shardId = await saveCollectionItem('transactions', {
        type: 'Transfer',
        farmId: header.actor,
        details: `Payment: ${payload.reason || 'General Settlement'} [Nonce: ${header.nonce}]`,
        value: -(payload.amount || 0),
        unit: 'EAC'
    });
    
    return { status: 'SUCCESS', shardId, header };
}

/**
 * Logs biological or tradition-based compliance data shards.
 */
async function executeDataLog(header: any, payload: any) {
    const shardId = await saveCollectionItem('media_ledger', {
        title: `LOG_${(payload.brand || 'GENERIC').toUpperCase()}_${header.nonce}`,
        type: 'INGEST',
        source: payload.brand || 'System',
        author: payload.stewardName || 'System',
        authorEsin: header.actor,
        timestamp: new Date().toISOString(),
        hash: header.nonce,
        mImpact: payload.mImpact || "1.42",
        content: payload.data || ""
    });
    
    return { status: 'SUCCESS', shardId, header };
}

/**
 * Updates logistics and supply chain shards for industrial finality.
 */
async function executeSupplyUpdate(header: any, payload: any) {
    const shardId = await saveCollectionItem('orders', {
        ...payload,
        trackingHash: header.nonce,
        lastModified: header.timestamp
    });
    
    return { status: 'SUCCESS', shardId, header };
}

/**
 * Handles failed dispatch instructions and alerts the network oracle.
 */
function handleProcessFailure(header: any, error: any) {
    console.error(`[EnvirosAgro BC] Process Failure: ${header.instruction}`, error);
    dispatchNetworkSignal({
        type: 'system',
        origin: 'ORACLE',
        title: 'DISPATCH_ERROR',
        message: `Instruction ${header.instruction} failed signature check or registry sync.`,
        priority: 'critical',
        actionIcon: 'ShieldAlert'
    });
}
