import express from 'express';
import api_middleware from '../middleware/api.js';import { DataType } from '@shopify/shopify-api';
import "dotenv/config";
import SamplesModel from '../models/SamplesModel.js';

import { GraphqlApi } from '../helpers/Helper.js';
const api = express.Router(); 
api.use("/api/*",api_middleware); 
import { AdminApi } from '../helpers/Helper.js';
const PORT = parseInt(process.env.PORT || "3822", 10); 
import Shop from '../models/ShopModel.js';
api.get("/api/test", (req, res) => {
    return res.send("Test api working...!");
});

api.post("/api/get_thankyou", function(req, res){
    var requested_details = [];
    var count_requested_ids = 0;
    var samples_ids = req.body.samples_ids;
    function fetched_coll(sample_id){
        SamplesModel.getBySampleId(sample_id, function(error, db_sample){
            requested_details.push(db_sample);
            console.log("requested_details",db_sample);
            count_requested_ids++;
            if(samples_ids[count_requested_ids]){
                fetched_coll(samples_ids[count_requested_ids]);
            }
            else{
                return res.send(requested_details);
            }
        });
    }
    if(samples_ids[count_requested_ids]){
        fetched_coll(samples_ids[count_requested_ids]);
    }
    else{
        return res.send("Not Found Any Sample id!");
    }
});

function getProductDetails(shop, handle, limit, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data: `
                query Product {
                    product(id:"gid://shopify/Product/${handle}") {
                        title
                        handle
                        tags
                        productType
                        vendor
                        id
                        legacyResourceId
                        featuredImage {
                            url
                        }
                        variants(first:10){
                            edges {
                                node {
                                    availableForSale
                                    id
                                    compareAtPrice
                                    price
                                    title
                                }
                            }
                        }
                    } 
                }
            `,
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function getSingleSample(shop, sample_id, callback) {
    AdminApi({
        shop: shop,
        type: "get",
        fetch: {
            path: "variants/"+sample_id,
            type: DataType.JSON
        }
    }, function(error, sample_data){
        if (typeof callback === "function") {
            callback(error, sample_data);
        }
    });
}

export default api;