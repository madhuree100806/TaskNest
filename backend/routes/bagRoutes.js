const express=require("express");

const router=express.Router();



const {

getBagItems,
createBagItem,
updateBagItem,
deleteBagItem

}=require("../controllers/bagController");




router.get("/",getBagItems);

router.post("/",createBagItem);

router.put("/:id",updateBagItem);

router.delete("/:id",deleteBagItem);



module.exports=router;