
import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

const calculateMConstant = (x: number, r: number): number => {
    return r * x * (1 - x);
};

const calculateAgroCode = (x: number, r: number, n: number): number => {
    let result = x;
    for (let i = 0; i < n; i++) {
        result = calculateMConstant(result, r);
    }
    return result;
};

export const getAgroCode = onRequest((request, response) => {
    try {
        const { x, r, n } = request.query;

        if (x === undefined || r === undefined || n === undefined) {
            response.status(400).send("Missing required query parameters: x, r, n");
            return;
        }

        const xNum = parseFloat(x as string);
        const rNum = parseFloat(r as string);
        const nNum = parseInt(n as string, 10);

        if (isNaN(xNum) || isNaN(rNum) || isNaN(nNum)) {
            response.status(400).send("Invalid number format for query parameters.");
            return;
        }

        const agroCode = calculateAgroCode(xNum, rNum, nNum);
        response.status(200).json({ agroCode });

    } catch (error) {
        functions.logger.error("Error calculating Agro Code:", error);
        response.status(500).send("Internal Server Error");
    }
});
