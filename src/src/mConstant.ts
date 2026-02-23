
import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

const calculateMConstant = (dn: number, in_val: number, ca: number, s: number): number => {
  const stress = Math.max(s, 0.001); // Prevent division by zero or negative stress
  return Math.sqrt((dn * in_val * ca) / stress);
};

export const getMConstant = onRequest((request, response) => {
    try {
        const { dn, in_val, ca, s } = request.query;

        if (dn === undefined || in_val === undefined || ca === undefined || s === undefined) {
            response.status(400).send("Missing required query parameters: dn, in_val, ca, s");
            return;
        }

        const dnNum = parseFloat(dn as string);
        const inValNum = parseFloat(in_val as string);
        const caNum = parseFloat(ca as string);
        const sNum = parseFloat(s as string);

        if (isNaN(dnNum) || isNaN(inValNum) || isNaN(caNum) || isNaN(sNum)) {
            response.status(400).send("Invalid number format for query parameters.");
            return;
        }

        const mConstant = calculateMConstant(dnNum, inValNum, caNum, sNum);
        response.status(200).json({ mConstant });

    } catch (error) {
        functions.logger.error("Error calculating M Constant:", error);
        response.status(500).send("Internal Server Error");
    }
});
