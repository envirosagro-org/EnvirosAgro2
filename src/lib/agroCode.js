"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgroCode = void 0;
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
const calculateMConstant = (x, r) => {
    return r * x * (1 - x);
};
const calculateAgroCode = (x, r, n) => {
    let result = x;
    for (let i = 0; i < n; i++) {
        result = calculateMConstant(result, r);
    }
    return result;
};
exports.getAgroCode = (0, https_1.onRequest)((request, response) => {
    try {
        const { x, r, n } = request.query;
        if (x === undefined || r === undefined || n === undefined) {
            response.status(400).send("Missing required query parameters: x, r, n");
            return;
        }
        const xNum = parseFloat(x);
        const rNum = parseFloat(r);
        const nNum = parseInt(n, 10);
        if (isNaN(xNum) || isNaN(rNum) || isNaN(nNum)) {
            response.status(400).send("Invalid number format for query parameters.");
            return;
        }
        const agroCode = calculateAgroCode(xNum, rNum, nNum);
        response.status(200).json({ agroCode });
    }
    catch (error) {
        functions.logger.error("Error calculating Agro Code:", error);
        response.status(500).send("Internal Server Error");
    }
});
//# sourceMappingURL=agroCode.js.map