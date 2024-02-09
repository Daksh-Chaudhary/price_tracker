import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";



export async function scrapeAmazonProduct(url:string) {
    if(!url)
        return;

        // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_1703db56-zone-unblocker:4770hnlukfsy -k https://lumtest.com/myip.json

    const username=String(process.env.BRIGHT_DATA_USERNAME)
    const password=String(process.env.BRIGHT_DATA_PASSWORD)
    const session_id=(1000000*Math.random())|0;
    const port=22225;
    const options={
        auth:{
            username: `${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorized:false,
    }
    try {
        //Fetch the product page
        const response=await axios.get(url,options);
        const $=cheerio.load(response.data);

        //Extract Product Title
        const title=$('#productTitle').text().trim();
        const currentPrice=extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base')
         );

         const originalPrice=extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price  span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')

         );


        const outOfStock= $('#availability span').text().trim().toLowerCase()==='currently unavailable';

        const images=$('#imgBlkFront').attr('data-a-dynamic-image')||
                    $('#landingImage').attr('data-a-dynamic-image')||
                    '{}';
        
        
        const imageUrls=Object.keys(JSON.parse(images))

        const currency=extractCurrency($('.a-price-symbol'))

        const discountRate= $('.savingsPercentage').text().replace(/[-%]/g,'');

        // console.log({title,currentPrice,originalPrice, outOfStock,imageUrls, currency,discountRate});
        //  Construct data object with scraped features
        const data={
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice),
            originalPrice: Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
        }

        console.log(data);

    } catch (error:any) {
        throw new Error(`Failed to scrape product:${error.message}`)
        
    }
}