import mongoose from "mongoose";
import 'dotenv/config';


const connectDB=async()=>{
    try{
       await mongoose.connect(`${process.env.MONGO_URL}`,{family:4});
       console.log("connected to DB....")
    }catch(err){
      console.log(err.message);
      
    }
}
export default connectDB;