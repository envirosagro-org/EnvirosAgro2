
import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { generateHash, createGenesisBlock, mineBlock } from "../../services/blockchainService";
import { AgroBlock, AgroTransaction } from "../types";

// Wrapper for generateHash
export const getHash = onRequest(async (request, response) => {
    try {
        const { data } = request.body;
        if (!data) {
            response.status(400).send("Missing 'data' in request body");
            return;
        }
        const hash = await generateHash(data);
        response.status(200).json({ hash });
    } catch (error) {
        functions.logger.error("Error generating hash:", error);
        response.status(500).send("Internal Server Error");
    }
});

// Wrapper for createGenesisBlock
export const createGenesis = onRequest(async (request, response) => {
    try {
        const genesisBlock = await createGenesisBlock();
        response.status(200).json(genesisBlock);
    } catch (error) {
        functions.logger.error("Error creating genesis block:", error);
        response.status(500).send("Internal Server Error");
    }
});

// Wrapper for mineBlock
export const mineNewBlock = onRequest(async (request, response) => {
    try {
        const { prevBlock, mempool, validator } = request.body;
        if (!prevBlock || !mempool || !validator) {
            response.status(400).send("Missing 'prevBlock', 'mempool', or 'validator' in request body");
            return;
        }

        const newBlock = await mineBlock(prevBlock as AgroBlock, mempool as AgroTransaction[], validator as string);
        response.status(200).json(newBlock);
    } catch (error) {
        functions.logger.error("Error mining block:", error);
        response.status(500).send("Internal Server Error");
    }
});
