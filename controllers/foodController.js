const Food = require("../models/foodModel");

const createFood = async (req,res) =>{
    try{
        const food =await Food.create(req.body);
        res.status(201).json({message:"food created" ,food})
    }catch(err){
        res.status(500).json({message: err.message})
    }
};

const getfoodByhotel = async(req,res) =>{
    try{
        const getfood = await Food.find({hotel :req.params.hotelID})
        res.status(200).json({getfood});
    }catch(err){
        res.status(500).json({message: err.message})
    }
};

const updateFood = async(req,res) => {
    try{
        const updatedfood = await Food.findByIdAndUpdate(req.params.id ,req.body ,{new:true});
        res.status(200).json({message:"Update successfully" ,updatedfood});
    }catch(err){
        res.status(500).json({message:"server error: Network connection Failed"});
    }
};

const deleteFood = async(req,res) =>{
    try{
        const deletedfood = await Food.findByIdAndDelete(req.params.id );
        res.status(200).json({message:"Food deleted" ,deletedfood});

    }catch{
        res.status(500).json({message:"server error: Network connection failed"});
    }
}

module.exports ={createFood ,getfoodByhotel ,updateFood ,deleteFood};

