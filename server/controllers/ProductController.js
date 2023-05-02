import { DataType } from "@shopify/shopify-api";
import { AdminApi } from "../helpers/Helper.js";
import Shop from '../models/ShopModel.js';
import ProductsModel from '../models/ProductsModel.js';
import SamplesModel from '../models/SamplesModel.js';
import ThankyouModel from '../models/ThankyouModel.js';
import { GraphqlApi } from '../helpers/Helper.js';
import fileCreate from '../aws-sdk-create.js';
import fileUpdate from '../aws-sdk-update.js';
import fileDelete from '../aws-sdk-delete.js';

import "dotenv/config";
import fs from 'fs';

class ProductController{
    createPack(req, res){
        const title = req.body.title;
        const genre = req.body.genre;
        const price = req.body.price;
        const cover_url = req.body.cover_url;
        const description = req.body.description;
        GraphqlApi({
            shop: req.body.shop,
            type: "query",
            fetch: {
                data: `
                    mutation  {
                        productCreate(
                            input: {
                                title: "${title}",
                                descriptionHtml: "${description}"
                            }
                        ){
                            product {
                                id
                            }
                        }
                    }
                `,
            }
        }, function(error, response){
            if(response && response.body && response.body.data && response.body.data.productCreate && response.body.data.productCreate.product && response.body.data.productCreate.product.id){
                const product_id = response.body.data.productCreate.product.id;
                const s_product_id = product_id.split("gid://shopify/Product/")[1];
                GraphqlApi({
                    shop: req.body.shop,
                    type: "query",
                    fetch: {
                        data: {
                            "query": `mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
                                productCreateMedia(media: $media, productId: $productId) {
                                    media {
                                        alt
                                        mediaContentType
                                        status
                                    }
                                    mediaUserErrors {
                                        field
                                        message
                                    }
                                    product {
                                        id
                                        title
                                    }
                                }
                            }`, "variables": {
                                    "media": {
                                        "alt": "Image",
                                        "mediaContentType": "IMAGE",
                                        "originalSource": cover_url
                                    },
                                "productId": product_id
                            }
                        }
                    }
                }, function(error, response){
                    if(response && response.body && response.body.data && response.body.data.productCreateMedia.media){
                        getPublish(req.body.shop, function (error, response) {
                            if(response && response.body && response.body.data && response.body.data.publications && response.body.data.publications.edges){
                                var publish_id = response.body.data.publications.edges[0].node.id;
                                GraphqlApi({
                                    shop: req.body.shop,
                                    type: "query",
                                    fetch: {
                                        data: {
                                            "query": `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
                                                publishablePublish(id: $id, input: $input) {
                                                    publishable {
                                                        availablePublicationCount
                                                        publicationCount
                                                    }
                                                    shop {
                                                        publicationCount
                                                    }
                                                    userErrors {
                                                        field
                                                        message
                                                    }
                                                }
                                            }`, "variables": {
                                                "input":  {
                                                    "publicationId": publish_id
                                                },
                                                "id": product_id
                                            },
                                        }
                                    }
                                }, function(error, response){
                                if(response && response.body && response.body.data && response.body.data.publishablePublish && response.body.data.publishablePublish.publishable){
                                    GraphqlApi({
                                        shop: req.body.shop,
                                        type: "query",
                                        fetch: {
                                            data: {
                                                "query": `mutation {
                                                    productUpdate(
                                                        input : {
                                                            id: "${product_id}",
                                                            metafields: [
                                                                {
                                                                    namespace: "media", 
                                                                    key: "featured_image",
                                                                    value: "${cover_url}",
                                                                    type:"single_line_text_field"
                                                                }
                                                            ]
                                                        }
                                                    )
                                                    {
                                                        product {
                                                            metafields(first: 100) {
                                                                edges {
                                                                    node {
                                                                    namespace
                                                                    key
                                                                    value
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                }`, "variables": {
                                                        "input":  {
                                                        "metafields": [
                                                                {
                                                                    "namespace": "media", 
                                                                    "key": "featured_image",
                                                                    "value": cover_url,
                                                                    "type":"single_line_text_field"
                                                                }
                                                            ],
                                                        },
                                                        "id": product_id
                                                    }
                                                }
                                            }
                                        }, function(error, response){
                                            if(response && response.body && response.body.data && response.body.data.productUpdate && response.body.data.productUpdate.product){
                                                getAllSampleAPI(req.body.shop, s_product_id, function(error, response){
                                                    if(response && response.body && response.body.data && response.body.data.product && response.body.data.product.variants){
                                                        var sample_id = response.body.data.product.variants.edges[0].node.id;
                                                        var title = response.body.data.product.variants.edges[0].node.title;
                                                        updateSamplePriceAPI(req.body.shop, sample_id, price, function(error, response){
                                                            if(response && response.body && response.body.data && response.body.data.productVariantUpdate && response.body.data.productVariantUpdate.productVariant){
                                                                var data = {};
                                                                data["shop"] = req.body.shop;
                                                                data["pack_id"] = s_product_id;
                                                                data["genre"] = genre;
                                                                data["image_src"] = cover_url;
                                                                ProductsModel.store(data, function (error, success) {
                                                                    if(success){
                                                                        ThankyouModel.count(req.body.shop, function(error, fetched){
                                                                            if(fetched > 0){
                                                                                return res.send({error, success});
                                                                            }
                                                                            else{
                                                                                var script_tag = {
                                                                                    "script_tag" : {
                                                                                        "src": process.env.HOST+"/lib/sephbeats_thankyou.js",
                                                                                        "event": "onload",
                                                                                        "display_scope": "order_status",
                                                                                        "cache": false   
                                                                                    }
                                                                                };
                                                                                AdminApi({
                                                                                    shop: req.body.shop, 
                                                                                    type: "post",
                                                                                    fetch: {
                                                                                        path: "script_tags",
                                                                                        data: script_tag,
                                                                                        type: DataType.JSON
                                                                                    }
                                                                                }, function(error, data){
                                                                                    if(data){
                                                                                        ThankyouModel.store(req.body, function(error, success){
                                                                                            if(success){
                                                                                                return res.send({success});
                                                                                            }
                                                                                            else{
                                                                                                return res.send( 
                                                                                                    {
                                                                                                        satus: 404,
                                                                                                        message: "not found"
                                                                                                    }
                                                                                                ); 
                                                                                            } 
                                                                                        });
                                                                                    }
                                                                                    else{
                                                                                        return res.send({
                                                                                            error: error,
                                                                                            status: 0
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                    else{
                                                                        console.log("pack saved in DB ERROR: ", error);
                                                                    }
                                                                });
                                                            }
                                                            else{
                                                                console.log("Variant creating error in DB ERROR: ", error);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            else{
                                                console.log(error);
                                            }
                                        });
                                    }
                                    else{
                                        console.log("pack save error", error);
                                        return res.send({
                                            error: error,
                                            status: 0
                                        });
                                    }
                                });
                            }
                            else{
                                console.log("product publish error", error);
                                return res.send({
                                    error: error,
                                    status: 0
                                });
                            }
                        });
                    }
                });
            }
            else{
                console.log("product create error", error);
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    updatePack(req, res){
        var product_id = "gid://shopify/Product/"+req.query.id;
        updatePackAPI(req.body.shop, product_id, req.body.title, req.body.description, req.body.cover_url, function(error, response){
            if(response && response.body && response.body.data && response.body.data.productUpdate && response.body.data.productUpdate.product){
                getAllSampleAPI(req.body.shop, req.query.id, function(error, response){
                    if(response && response.body && response.body.data && response.body.data.product && response.body.data.product.variants && response.body.data.product.variants.edges){
                        var sample_id = response.body.data.product.variants.edges[0].node.id;
                        updateSamplePriceAPI(req.body.shop, sample_id, req.body.price, function(error, response){
                            if(response){
                                var data = {};
                                data["image_src"] = req.body.cover_url;
                                ProductsModel.updateByPack(req.query.id, data, function(error, saved) {
                                    return res.send({
                                        error, saved
                                    });
                                });
                            }
                            else{
                                return res.send({
                                    error: error,
                                    status: 0
                                });
                            }
                        });
                    }
                });
            }
            else{
                console.log(error);
            }
        });
    }

    getSinglePack(req, res){
        SamplesModel.countByPackId(req.query.pack_id, function(error, samples_count){
            GraphqlApi({
                shop: req.query.shop,
                type: "query",
                fetch: {
                    data: `
                        query Product {
                            product(id:"gid://shopify/Product/${req.query.pack_id}") {
                                title
                                handle
                                tags
                                productType
                                vendor
                                id
                                legacyResourceId
                                description
                                featuredImage {
                                    url
                                }
                                variants(first:1){
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
                if (response && response.body) {
                    var product_response = response.body.data.product;
                    return res.send({product_response, samples_count});
                }
                else{
                    return res.send({
                        error,response
                    });
                }
            });
        });
    }

    getAllPacks(req, res){
        const { shop } = req.query;
        ("getAllPacks", shop);
        ProductsModel.paginate(req, function(error, products){
            if(products){ 
                return res.send(products);
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    deletePack(req, res){
        deletePackAPI(req.query.shop, req.query.id, function(error, response){
            if( response && response.body){
                SamplesModel.deleteAllSamplesByPackId(req.query.id, function(error, data){
                    if(data){
                        ProductsModel.deleteByPackid(req.query.id, function(error, data){
                            if(data){
                                return res.send(data);
                            }
                            else{
                                return res.send({
                                    error: error,
                                    status: 0
                                });
                            }
                        });
                    }
                    else{
                        return res.send({
                            error: error,
                            status: 0
                        });
                    }
                });
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    addSample(req, res){
        console.log("addSample function", req.file);
        let file_url = null;
        if(req.file){
            fileCreate(req.file, function(error, data){
                if(data){
                    console.log("data:", data.Location);
                }
                else{
                    var filePath = req.file.path; 
                    fs.unlinkSync(filePath);

                    console.log("error", error.Location);
                    var shop = req.body.shop;
                    var title = req.body.title;
                    var price = req.body.price;
                    var bpm = req.body.bpm;
                    var cover_url = error.Location;
                    var product_id = "gid://shopify/Product/"+req.body.pack_id;
                    Shop.getByShop(req.body.shop, function(error, shopData){
                        if (shopData) {
                            var location_id = shopData.info.primary_location_id;
                            createSamplesAPI(shop, product_id, title, price, bpm, cover_url, location_id, req.body.type, function (error, response) {
                                if(response && response.body.data && response.body.data.productVariantsBulkCreate && response.body.data.productVariantsBulkCreate.productVariants){
                                    var metafield_id = response.body.data.productVariantsBulkCreate.productVariants[0].metafields.edges[0].node.id;
                                    var sample_id = response.body.data.productVariantsBulkCreate.productVariants[0].id;
                                    var data = {};
                                    // data["pack_id"] = req.body.pack_id;
                                    data["sample_id"] = sample_id.split("gid://shopify/ProductVariant/")[1];
                                    // data["filesUrl"] = req.body.cover_url;
                                    // data["bpm"] = req.body.bpm;
                                    // data["type"] = req.body.type;
                                    data["pack_id"] = req.body.pack_id;
                                    data["filesUrl"] = req.file.filename;
                                    data["metafield_id"] = metafield_id.split("gid://shopify/Metafield/")[1];
                                    SamplesModel.store(data, function (error, response) {
                                        if(response){
                                            return res.send({error, response});
                                        }
                                        else{
                                            console.log("sample saved in DB ERROR: ", error);
                                        }
                                    });
                                }
                                else{
                                    return res.send({
                                        error,response
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    countSample(req, res){
        SamplesModel.countByPackId(req.query.product_id, function(error, samples_count){
            console.log("samples_count:", samples_count);
            if(samples_count){
                return res.send({samples_count});
            }
        });
    }

    getSingleSample(req, res) {
        var req_data = req.query;
        console.log(req_data);
        getSingleSampleAPI(req_data, function(error, response){
            if(response && response.body && response.body.data){
                console.log("getSingleSampleAPI:", response.body.data);
                var variant = response.body.data.productVariant;
                return res.send(variant);
            }
        });
    }

    getAllSamples(req, res){
        var shop = req.query.shop;
        var product_id = req.query.product_id;
        getAllSampleAPI(shop, product_id, function(error, response){
            // console.log("getAllSampleAPI 1: ", response.body.data.product.variants);
            if(response && response.body.data && response.body.data.product && response.body.data.product.variants){
                var requested_variants = [];
                var count_variants = 0;
                var all_variants = response.body.data.product.variants.edges;
                // console.log("getAllSampleAPI: ", all_variants);
                // SamplesModel.getAllByPackId(product_id, function(error, db_variant){
                function fetched_coll(variant){
                    // var variants = response.body.data.product.variants.edges[0].node.metafields.edges[0].node.namespace;
                    // console.log("this variant: ", variant.node.metafields);
                    if(variant.node.metafields.edges[0]){
                        requested_variants.push(variant);
                        count_variants++;
                        if(all_variants[count_variants]){
                            fetched_coll(all_variants[count_variants]);
                        }
                        else{
                            return res.send(requested_variants);
                        }
                    }
                    else{
                    // const temp = {};
                    // for (const obj1 of variant) {
                    //     temp[obj1.node.id.split("gid://shopify/ProductVariant/")[1]] = { ...obj1 };
                    // }
                    // for (const obj2 of db_variant) {
                    //     const destination = temp[obj2.sample_id];
                    //     for (const [key, value] of Object.entries(obj2)) {
                    //         if (destination[key]) destination[`stateTypes-${key}`] = value;
                    //         else destination[key] = value;
                    //     }
                    // }
                    // const variants = Object.values(temp);
                        count_variants++;
                        if(all_variants[count_variants]){
                            fetched_coll(all_variants[count_variants]);
                        }
                        else{
                            console.log("requested_variants", requested_variants);
                            return res.send(requested_variants);
                        }
                    }
                }
                if(all_variants[count_variants]){
                    fetched_coll(all_variants[count_variants]);
                }
                else{
                    return res.send("Not Found Any Sample !");
                }
                    // return res.send(variants);
            }
            else{
                return res.send({error});
            }
        });
    }

    updateSample(req, res){
        var req_data = req.body;
        console.log("updateSample: ", req_data);
        SamplesModel.getBySampleId(req_data.sample_id, function(error, db_sample_data){
            if(db_sample_data){
                console.log("db_sample_data: ", db_sample_data);
                deleteSampleMetafieldAPI(req_data.shop, db_sample_data.metafield_id, function(error, response){
                    if(response && response.body){
                        console.log("response.body: ", response.body);
                        fileUpdate(db_sample_data.filesUrl, req.file, function(updated_in_do, error){
                            console.log("update_data: ", updated_in_do);
                            if(updated_in_do){
                                req_data["filesUrl"] = updated_in_do.Location;
                                updateSampleMetafieldAPI(req_data, function(error, response){
                                    if(response && response.body && response.body.data && response.body.data.productVariantUpdate){
                                        var metafield_id = response.body.data.productVariantUpdate.productVariant.metafields.edges[0].node.id;
                                        console.log("Here: ", metafield_id);
                                        updateSampleAPI(req_data, function(error, response){
                                            if(response){
                                                var data = {};
                                                data["filesUrl"] = updated_in_do.key;
                                                data["metafield_id"] = metafield_id.split("gid://shopify/Metafield/")[1];
                                                SamplesModel.updateOneBySampleId(req.body.sample_id, data, function(error, data){
                                                    return res.send(data);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    deleteSample(req, res){
        var shop = req.query.shop;
        var sample_id = "gid://shopify/ProductVariant/"+req.query.id;
        deleteSampleAPI(shop, sample_id, function(error, response){
            if(response && response.body && response.body.data && response.body.data.productVariantDelete && response.body.data.productVariantDelete.product){
                SamplesModel.deleteBySampleid(req.query.id, function(error, data){
                    if(data){
                        return res.send(data);
                    }
                    else{
                        return res.send({
                            error: error,
                            status: 0
                        });
                    }
                });
            }
            else{
                return res.send({error});
            }
        });
    }
}

function getPublish(shop, callback) {
    GraphqlApi({ 
        shop: shop,
        type: "query",
        fetch: {
            data: `{
                publications(first:1){
                    edges{
                        node{
                            id
                        }
                    }
                }
            }`,
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function deletePackAPI(shop, product_id, callback) {
    AdminApi({
        shop: shop,
        type: "delete",
        fetch: {
            path: "products/"+product_id,
            type: DataType.JSON
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function deleteSampleMetafieldAPI(shop, metafield_id, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation {
                    metafieldDelete(input: {
                        id: "gid://shopify/Metafield/${metafield_id}",
                    }) {
                    deletedId
                        userErrors {
                            field
                            message
                        }
                    }
              }
              `                  
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function getSingleSampleAPI(req_data, callback){
    GraphqlApi({
        shop: req_data.shop,
        type: "query",
        fetch: {
            data:{ 
                "query": `{ 
                    productVariant(id: "gid://shopify/ProductVariant/${req_data.id}") {
                        title
                        displayName
                        createdAt
                        price
                        compareAtPrice
                        inventoryQuantity
                        availableForSale
                        weight
                        weightUnit
                        metafields(first: 1) {
                            edges {
                                node {
                                    namespace
                                    value
                                    key
                                }
                            }
                        }
                    }
                }`
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function updateSampleMetafieldAPI(req_data, callback){
    GraphqlApi({
        shop: req_data.shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation updateProductVariantMetafields($input: ProductVariantInput!) {
                    productVariantUpdate(input: $input) {
                        productVariant {
                            id
                            metafields(first: 3) {
                                edges{
                                    node {
                                        id
                                        namespace
                                        key
                                        value
                                    }
                                }
                            }
                        }
                        userErrors {
                            message
                            field
                        }
                    }
                }`, "variables": {
                    "input": {
                        "metafields": [
                            {
                                "namespace": "sgtw_sample", 
                                "key": "file_urls",
                                "value": JSON.stringify(
                                    {
                                        cover_url:req_data.filesUrl,
                                        bpm:req_data.bpm,
                                        type:req_data.type
                                    }
                                ),
                                "type":"json"
                            }
                        ],
                        "id": "gid://shopify/ProductVariant/"+req_data.sample_id
                    }
                }                  
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function createSamplesAPI(shop, product_id, title, price, bpm, cover_url, location_id, type,  callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                    productVariantsBulkCreate(productId: $productId, variants: $variants) {
                        product {
                            id
                        }
                        productVariants {
                            id
                            metafields(first: 1) {
                                edges {
                                    node {
                                        id
                                        namespace
                                        key
                                        value
                                    }
                                }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
                `, "variables": {
                    "variants": [
                        {
                            "options": [
                                title
                            ],
                            "price": price,
                            "mediaSrc": [
                                cover_url
                            ],
                            "inventoryQuantities": [
                                {
                                  "availableQuantity": 5,
                                  "locationId": "gid://shopify/Location/"+location_id
                                }
                            ],
                            "metafields": [
                                {
                                    "namespace":"sgtw_sample", 
                                    "key":"file_url",
                                    "value":JSON.stringify(
                                        {
                                            cover_url:cover_url,
                                            bpm:bpm,
                                            type:type
                                        }
                                    ),
                                    "type":"json"
                                }
                            ]
                        }
                    ],
                    "productId": product_id,
                }
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function updateSampleAPI(req_data, callback){
    GraphqlApi({
        shop: req_data.shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation {
                productVariantUpdate(input: {id: "gid://shopify/ProductVariant/${req_data.sample_id}", price: "${req_data.price}", options: ["${req_data.title}"]}) {
                productVariant {
                    id
                    legacyResourceId
                    sku
                    barcode
                    weight
                    weightUnit
                    inventoryItem {
                    id
                    legacyResourceId
                    requiresShipping
                    unitCost {
                        amount
                    }
                    }
                    position
                    selectedOptions {
                    name
                    value
                    }
                    product {
                    id
                    title
                    legacyResourceId
                    }
                }
                userErrors {
                    field
                    message
                }
                }
            }`,
            "variants": [
                {
                    "options": [
                        req_data.title
                    ],
                    "price": req_data.price,
                    "mediaSrc": [
                        req_data.filesUrl
                    ],
                    "metafields": [
                        {
                            "namespace": "sgtw_sample", 
                            "key": "file_url",
                            "value": JSON.stringify(
                                {
                                    cover_url:req_data.filesUrl,
                                    bpm:req_data.bpm,
                                    type:req_data.type
                                }
                            ),
                            "type":"json"
                        }
                    ]
                }
            ],
            "productId": req_data.pack_id,
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function updateSamplePriceAPI(shop, sample_id, price, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation productVariantUpdate($input: ProductVariantInput!) {
                    productVariantUpdate(input: $input) {
                        productVariant {
                            id
                            title
                            inventoryPolicy
                            inventoryQuantity
                            price
                            compareAtPrice
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }`, "variables": {
                    "input": {
                        "id": sample_id,
                        "price": price,
                        "compareAtPrice": "00.00"
                    }
                }
            }
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function getAllSampleAPI(shop, product_id, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{
                "query": `{
                    product(id: "gid://shopify/Product/${product_id}") {
                        variants(first: 199) {
                            edges {
                                node {
                                    id
                                    sku
                                    price
                                    title
                                    product {
                                        id
                                    }
                                    metafields(first: 1) {
                                        edges {
                                            node {
                                                namespace
                                                value
                                                key
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`
            },
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function updatePackAPI(shop, product_id, title, description, cover_url, callback){
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data: {
                "query": `mutation {
                    productUpdate(input: {id: "${product_id}", title: "${title}", bodyHtml: "${description}", images: [ { altText: "adasd", src: "${cover_url}" } ]}) {
                        product {
                            id
                        }
                    }
                }`
            }
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
}

function deleteSampleAPI(shop, sample_id, callback) {
    GraphqlApi({
        shop: shop,
        type: "query",
        fetch: {
            data:{ "query": `mutation productVariantDelete($id: ID!) {
                    productVariantDelete(id: $id) {
                    deletedProductVariantId
                    product {
                        id
                        title
                    }
                    userErrors {
                        field
                        message
                    }
                    }
                }`, "variables": {
                        "id": sample_id
                }
            }
        }
    }, function(error, response){
        if (typeof callback === "function") {
            callback(error, response);
        }
    });
 }

export default new ProductController();