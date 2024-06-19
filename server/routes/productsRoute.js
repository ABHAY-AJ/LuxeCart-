const router = require("express").Router();
const Product = require("../models/productModel");
const User = require("../models/userModel")
const authMiddleware = require("../middlwares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const Notification = require("../models/notificationsModel");
const multer = require("multer");


// add a new product
router.post("/add-product", authMiddleware, async(req,res)=>{
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        // send notification to admin
        const admins = await User.find({role: "admin"});
        admins.forEach(async(admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New product added ${req.body.name}`,
                title: "New Product",
                onClick: `/admin`,
                read: false,
            });
            await newNotification.save();
        });
        res.send({
            success:true,
            message: "Product added successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});




// get all products'
router.post("/get-products", async(req, res)=>{
    try {
        const {seller, category=[], age=[], status, searchTerm} = req.body;
        let filters = {}
        if(seller){
            filters.seller = seller
        }
        if(status){
            filters.status = status
        }


        // filter by category
        if(category.length > 0){
            filters.category = {$in: category};
        }

        // filter by age
        if(age.length > 0){
            age.forEach((item)=>{
                const fromAge = item.split("-")[0];
                const toAge = item.split("-")[1];
                filters.age = {$gte: fromAge, $lte: toAge};
            });
        }

        // filter by search term
        if(searchTerm){
            filters.$or = [
                {name:{$regex: searchTerm, $options: "i"}},
                {description:{$regex: searchTerm, $options: "i"}},
            ];
        }

        const products = await Product.find(
            filters
        ).populate("seller").sort({createdAt: -1});
        res.send({
            success:true,
            data: products,
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

//get a product by id
router.get("/get-product-by-id/:id", async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// edit a product
router.put("/edit-product/:id", authMiddleware, async(req, res)=>{
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success:true,
            message: "Product update successfully"
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
})

// delete a product
router.delete("/delete-product/:id", authMiddleware, async(req, res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success:true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
})



//get image from pc

const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});


router.post("/upload-image-to-product", authMiddleware, multer({storage:storage}).single("file"),async(req,res)=>{
try {
    //upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder: "LuxeCart",
    });
    const productId = req.body.productId;
    await Product.findByIdAndUpdate(productId,{
        $push:{images:result.secure_url},
    });
    res.send({
        success:true,
        message: "image uploaded successfully",
        data : result.secure_url,
    })
    
} catch (error) {
    res.send({
        success:false,
        message:error.message,
    })
}
})


// update product status
router.put("/update-product-status/:id", authMiddleware, async(req, res) => {
    try {
        const {status} = req.body;
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {status});

        // send notification to seller
        const newNotification = new Notification({
            user: updateProduct.seller,
            message: `Your product ${updateProduct.name} has been ${status}`,
            title: "Product Status Updated",
            onClick: `/profile`,
            read: false,
        })
        await newNotification.save();

        res.send({
            success: true,
            message: "Product status updated successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})




module.exports = router;