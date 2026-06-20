import express from "express";
import { socialBotService } from "../services/socialBotService";
import { generateAlphanumericId } from "../systemFunctions";
import { initiateMpesaStkPush } from "../services/mpesaService";

const router = express.Router();

// M-Pesa Daraja payment proxy routes
router.post("/mpesa/stkpush", async (req, res) => {
  const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

  if (!phoneNumber || !amount || !accountReference) {
    return res.status(400).json({ error: "Missing required fields: phoneNumber, amount, accountReference" });
  }

  try {
    const result = await initiateMpesaStkPush({
      phoneNumber,
      amount: Number(amount),
      accountReference,
      transactionDesc
    });
    res.json({ status: "success", data: result });
  } catch (error: any) {
    console.error("[Daraja Route Error]", error);
    res.status(500).json({ error: error.message || "Failed to trigger Daraja STK Push session" });
  }
});

router.post("/mpesa/callback", (req, res) => {
  console.log("[M-Pesa Callback Received]:", JSON.stringify(req.body, null, 2));
  // In production, you would process the transaction result, check for success, 
  // and credit the user's wallet accordingly. Since state is client-focused in this prototype,
  // we return success.
  res.json({ ResultCode: 0, ResultDesc: "Success" });
});


// Social Media Alliance
router.post("/social/post", (req, res) => {
  const { platform, content, prompt } = req.body;
  
  if (!platform || !content) {
    return res.status(400).json({ error: "Missing required fields: platform and content" });
  }

  const taskId = generateAlphanumericId();
  
  socialBotService.scheduleTask({
    id: taskId,
    platform: platform,
    type: req.body.type || 'POST',
    content: content,
    prompt: prompt,
    scheduledTime: req.body.scheduledTime || new Date().toISOString(),
    status: 'PENDING'
  });
  
  res.json({ status: "success", taskId });
});

// M2M Bridges
router.post("/m2m/bridge", (req, res) => {
  const { target, action } = req.body;
  
  if (!target || !action) {
    return res.status(400).json({ error: "Missing required fields: target and action" });
  }

  console.log(`[API] M2M bridge action ${action} to ${target}`);
  res.json({ status: "success" });
});

// Automation Integration
router.post("/automation/task", (req, res) => {
  const { taskId, action } = req.body;
  
  if (!taskId || !action) {
    return res.status(400).json({ error: "Missing required fields: taskId and action" });
  }

  console.log(`[API] Automation task ${taskId}: ${action}`);
  res.json({ status: "success" });
});

export default router;
