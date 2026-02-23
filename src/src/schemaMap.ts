import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { User } from "../../types"; // Assuming User type is in `types.ts`

const db = admin.firestore();
const BASE_URL = "https://yourapp.com"; // Replace with your actual domain

// Helper to generate a URL entry for the sitemap
const createUrlEntry = (loc: string, lastmod: string, changefreq: string, priority: string): string => {
    return `
        <url>
            <loc>${loc}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
        </url>
    `;
};

export const schemaMapXml = functions.https.onRequest(async (request, response) => {
    try {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        `;

        // 1. Static pages
        xml += createUrlEntry(`${BASE_URL}/`, new Date().toISOString(), "daily", "1.0");
        xml += createUrlEntry(`${BASE_URL}/about`, new Date().toISOString(), "monthly", "0.8");
        xml += createUrlEntry(`${BASE_URL}/contact`, new Date().toISOString(), "yearly", "0.5");

        // 2. Dynamic pages: Stewards (Users)
        const stewardsSnapshot = await db.collection("stewards").get();
        stewardsSnapshot.forEach(doc => {
            const steward = doc.data() as User;
            // Assuming regDate is a string that can be parsed as a date
            const lastMod = steward.regDate ? new Date(steward.regDate).toISOString() : new Date().toISOString();
            xml += createUrlEntry(`${BASE_URL}/steward/${doc.id}`, lastMod, "weekly", "0.7");
        });

        // 3. Dynamic pages: Vendor Products
        const productsSnapshot = await db.collection("vendor_products").where("status", "==", "AUTHORIZED").get();
        productsSnapshot.forEach(doc => {
            const product = doc.data();
            const lastMod = product.timestamp ? new Date(product.timestamp).toISOString() : new Date().toISOString();
            xml += createUrlEntry(`${BASE_URL}/market/${doc.id}`, lastMod, "daily", "0.9");
        });
        
        // 4. Dynamic pages: Research Papers
        const papersSnapshot = await db.collection("research_papers").where("status", "==", "Published").get();
        papersSnapshot.forEach(doc => {
            const paper = doc.data();
            const lastMod = paper.timestamp ? new Date(paper.timestamp).toISOString() : new Date().toISOString();
            xml += createUrlEntry(`${BASE_URL}/research/${doc.id}`, lastMod, "monthly", "0.8");
        });

        xml += `
            </urlset>
        `;

        response.set("Content-Type", "application/xml");
        response.status(200).send(xml);

    } catch (error) {
        functions.logger.error("Error generating sitemap:", error);
        response.status(500).send("Internal Server Error");
    }
});
