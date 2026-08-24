const express = require("express");

const {
    getFolders,
    createFolder,
    deleteFolder
} = require("../controllers/folderController");

const router = express.Router();

router.get("/", getFolders);
router.post("/", createFolder);
router.delete("/:id", deleteFolder);

module.exports = router;