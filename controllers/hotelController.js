const Hotel =require("../models/hotelModel");

const createHotel =async(req,res) =>{
    try{
        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);

    }catch(err){
        res.status(500).json({message: err.message});
    }
};

const getHotel = async (req,res) =>{
    try{
        const hotels =await Hotel.find();
        res.status(200).json(hotels);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateHotel =async(req,res)=>{
    try{
        const updatedhotel = await Hotel.findByIdAndUpdate(req.params.id ,req.body ,{new:true});
        res.status(200).json({message:"Hotel updated" ,updatedhotel});
    }catch{
        res.status(500).json({message:"server error: network connection failed"});

    }
}

const deleteHotel = async (req,res) =>{
    try{
        const deletedhotel = await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Hotel deleted" ,deletedhotel});
    }catch(err){
        res.status(500).json({message:"server error : Network connection failed"})

    }
};

module.exports ={createHotel ,getHotel ,updateHotel,getHotelById ,deleteHotel};
