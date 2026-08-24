const express=require("express");

const router=express.Router();


const {

getBirthdays,
createBirthday,
updateBirthday,
deleteBirthday

}=require("../controllers/birthdayController");



router.get("/",getBirthdays);

router.post("/",createBirthday);

router.put("/:id",updateBirthday);

router.delete("/:id",deleteBirthday);



module.exports=router;