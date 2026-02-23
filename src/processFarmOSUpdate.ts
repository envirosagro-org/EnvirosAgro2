
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const processFarmOSUpdate = functions.https.onCall(async (data, context) => {
  const { nodeId, telemetry } = data;
  const db = admin.firestore();
  const nodeRef = db.collection('nodes').doc(nodeId);

  const { x, r, n, dn, In, s } = telemetry;
  const mConstant = (x * r * n) / (dn * In * s);
  const caValue = Math.log(1 + mConstant);

  const nodeData = {
    sustainability_metrics: {
      ca_value: caValue,
      m_constant: mConstant,
    },
    last_updated: admin.firestore.FieldValue.serverTimestamp(),
  };

  await nodeRef.set(nodeData, { merge: true });

  return nodeData;
});
