import Controller from '../app/Controller.js';
import ThankyouModel from '../models/ThankyouModel.js';
import { createMetafield } from '../helpers/MetafieldHelper.js';
import { deleteMetafield } from '../helpers/MetafieldHelper.js';
import { updateMetafield } from '../helpers/MetafieldHelper.js';
import { AdminApi } from '../helpers/Helper.js';
import { DataType } from '@shopify/shopify-api';

class ThankyouController extends Controller {
    updateThankyou(req, res){
        const { shop } = req.body;
        // fetch count ??
        // if count > 0 ? update else create
        ThankyouModel.count(shop, function(error, fetched){
            console.log("fetched: ", fetched);
            if(fetched > 0){
                ThankyouModel.getByShop(shop, function(error, data){
                    if(data && data.metafield && data.metafield.id){
                        var params_update = {
                            "metafield" : {
                                key: data.metafield.key,
                                value: JSON.stringify(req.body.thankyou)
                            }
                        };
                        updateMetafield(shop, data.metafield.id, params_update, function(error, updated){
                            if(updated){
                                req.body["metafield"] = {
                                    id: data.metafield.id,
                                    key: data.metafield.key,
                                    value: JSON.stringify(req.body.thankyou)
                                };
                                ThankyouModel.updateOneByShop(shop, req.body, function(error, success){
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
                                return res.send(
                                    {
                                        satus: 404,
                                        error:error
                                    }
                                ); 
                            } 

                        });
                    }
                    else{
                        var metafield = {
                            "metafield" : {
                                namespace: "sephbeats_thankyou",
                                key: "thankyou",
                                value: JSON.stringify(req.body.thankyou),  
                                type: "json" 
                            }
                        };
                        createMetafield(req.body.shop, metafield, function (error, metafield_response) {
                            if (metafield_response && metafield_response.body && metafield_response.body.metafield) {
                                const { id, key, namespace } = metafield_response.body.metafield;
                                req.body["metafield"] = {
                                    id: id,
                                    key: key,
                                    namespace: namespace
                                };
                                ThankyouModel.updateOneByShop(shop, req.body, function(error, success){
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
                                return res.send( 
                                    {
                                        satus: 404,
                                        message: "not found"
                                    }
                                );
                            }
                        });
                    } 
                });
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
                    shop: shop, 
                    type: "post",
                    fetch: {
                        path: "script_tags",
                        data: script_tag,
                        type: DataType.JSON
                    }
                }, function(error, data){
                    if(data){
                        return res.send({data});
                    }
                    else{
                        return res.send({
                            error: error,
                            status: 0
                        });
                    }
                });
                var metafield = {
                    "metafield" : {
                        namespace: "sephbeats_thankyou",
                        key: "thankyou",
                        value: JSON.stringify(req.body.thankyou),  
                        type: "json" 
                    }
                };

                createMetafield(req.body.shop, metafield, function (error, metafield_response) {
                    if (metafield_response && metafield_response.body && metafield_response.body.metafield) {
                        const { id, key, namespace } = metafield_response.body.metafield;
                        req.body["metafield"] = {
                            id: id,
                            key: key,
                            namespace: namespace
                        };
                        ThankyouModel.store(req.body, function(error, success){
                            if(success){
                                console.log("success", success);
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
                        return res.send( 
                            {
                                satus: 404,
                                message: "not found"
                            }
                        );
                    }
                });
            }
        });
    }
}

export default new ThankyouController();