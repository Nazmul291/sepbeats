import express from 'express';
import "dotenv/config";
import EventsHelper from "../helpers/EventsHelper.js";
//import controllers here
import PaymentController from "../controllers/PaymentController.js";
import Shops from "../controllers/Shops.js";
import ThemeController from '../controllers/ThemeController.js';
import ProductController from '../controllers/ProductController.js';
import ThankyouController from '../controllers/ThankyouController.js';
import shopValidate from "../middleware/shopValidate.js";
const route = express.Router(); 
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("file: ", file);
      cb(null, './public/files');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s/g, '-');
      cb(null, uniqueSuffix);
    },
  });
  
  const upload = multer({ storage: storage });

route.get("/merchant/shop_plan", PaymentController.plan);


route.post("/merchant/add_product", ProductController.createPack);
route.get("/merchant/products", ProductController.getAllPacks);
route.get("/merchant/get_pack", ProductController.getSinglePack);
route.delete("/merchant/delete_pack", ProductController.deletePack);
route.put("/merchant/update_pack", ProductController.updatePack);

route.post("/merchant/add_samples", upload.single('audio'), ProductController.addSample);
route.get("/merchant/get_all_samples", ProductController.getAllSamples);
route.delete("/merchant/sample/delete", ProductController.deleteSample);
route.get("/merchant/edit_sample", ProductController.getSingleSample);
route.put("/merchant/update_sample", upload.single('audio'), ProductController.updateSample);
route.get("/merchant/count_sample", ProductController.countSample);

// product

route.get("/shop/get.json", Shops.index);
route.post("/shop/create.json", Shops.store);
route.put("/shop/update.json", Shops.udpate);
route.delete("/shop/delete.json", Shops.delete);

// payment

route.get("/payment/invoice.json", PaymentController.createInvoice);
route.get("/payment/invoice/accept.json", PaymentController.invoiceCallback);
route.get("/payment/get.json", PaymentController.get);
route.get("/payment/status.json", PaymentController.status);
route.post("/payment/create.json", PaymentController.store);
route.put("/payment/update.json", PaymentController.udpate);
route.delete("/payment/delete.json", PaymentController.delete);

//theme
 
route.get("/merchant/themes/all", ThemeController.themes);
route.get("/themes/status.json", ThemeController.status);
route.post("/themes/install.json", ThemeController.install);
route.post("/themes/uninstall.json", ThemeController.uninstall);


route.post("/merchant/thankyou", ThankyouController.updateThankyou);

export default route;