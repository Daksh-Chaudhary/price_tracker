"use server"

import { connectTODB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl:string){
    if(!productUrl)
    return;
    try{
        connectTODB();

        const scrapedProduct= await scrapeAmazonProduct(productUrl);

        if(!scrapedProduct) return;

        let product=scrapedProduct;

        // const existingProduct=await 

    }
    catch(error:any){
        throw new Error(`failed to create/update product: ${error.message}`)
    }
}