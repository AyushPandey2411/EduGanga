const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    //can add trim,required wherever you feel required
    courseName:{
      type:String,
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingAndReviews:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"RatingAndReview",
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
        ref:"Tag",
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }],
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"]
    },
    createdAt: {
		type:Date,
		default:Date.now
	},

});

module.exports=mongoose.model("Course",courseSchema);
