const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to the database");
    }catch(error){
        console.log("Error occured while connecting to the database");
        console.log(error);
    }
}



module.exports = connectDB;