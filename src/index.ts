
import { dispatchService } from "./src/dispatch";
import { envirosAgroAI } from "./src/envirosAgroAI";
import { notificationService } from "./src/notifications";
import { oracleService } from "./src/oracle";
import { createPaypalOrder, capturePaypalOrder, requestWithdrawal } from "./src/paypal";
import { schemaMapXml } from "./src/schemaMap";
import { processFarmOSUpdate } from "./processFarmOSUpdate";

export const dispatch = dispatchService;
export const envirosAgro = envirosAgroAI;
export const notifications = notificationService;
export const oracle = oracleService;
export const paypal = {
  createOrder: createPaypalOrder,
  captureOrder: capturePaypalOrder,
  requestWithdrawal: requestWithdrawal,
};
export const sitemap = schemaMapXml;
export const processFarmOSUpdate = processFarmOSUpdate;
