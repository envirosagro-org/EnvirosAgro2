import express from "express";
import { socialBotService } from "../services/socialBotService";
import { generateAlphanumericId } from "../systemFunctions";

const router = express.Router();

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
