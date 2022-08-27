const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Review = require('./models/Review');
const User = require('./models/User');

/*** data ****/
const categories = require('./data/categories');
const products = require('./data/products');

/*** config dotenv  ***/
dotenv.config()

/*** config mongoose ***/
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on('connected', ()=>{
    console.log('Database connected');
});
mongoose.connection.on('error', ()=>{
    console.log('Database is not connected');
})

//IMPORT DATA
const importData = async()=>{
    try{
        const createCategories = await Category.insertMany(categories);
        console.log(createCategories);
        const sampleProducts = products.map(product=>{
            switch(product.category){
                case 'electronics':
                    return {...product, category: createCategories[0]._id};
                case 'toys':
                    return {...product, category: createCategories[1]._id};
            }
        });
        await Product.insertMany(sampleProducts);
        console.log('Data imported');
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}


// CLEAR DATA
const clearAllData = async()=>{
    try{
        await Category.deleteMany();
        await Order.deleteMany();
        await Product.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log("Data have been cleared");
    }catch(error){
        console.log(error);
        //process.exit(1) will terminate the process event if asynchronous calls have not completed
        //process.exit(0) let node terminate the async operation
        process.exit(1);
    }
}

if(process.argv[2] === '-d'){
    clearAllData()
}else{
    importData()
}
