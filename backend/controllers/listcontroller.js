import Listmodel from "../models/Listmodel.js";

export const getallList = async (req,res) => {
    try {
        const list = await Listmodel.find();
       return  res.json({ success: "success",
                            listofall:list
                    });
    }
    catch(error) {
        res.json({success: false, message: error.message})
    }
}

export  const addtolist = async (req,res) => {

    const { movieid, moviename , imageurl , language} = req.body;

    if(!moviename ) {
        return res.json({success:false , message: "movie name is required"})
    }


    try{

        if(!movieid) {
            return res.json({success:false , message : "movieid can not be found"})
        }

        const insertList = await Listmodel.findOne({movieid : movieid });

        if(insertList) {
            return res.json({success : false , message : "already added"})
        }
        
        const newlist = await new Listmodel({movieid,moviename,imageurl,language} )

        await newlist.save();
        
        return res.json({success: true , message : "added to the database"})
    }

    catch(error) {
        res.json({success : false , message : error.message})
    }
}

export const deleteList = async (req,res) => {

    const  id  = req.params.id;

    console.log("this is id from controller",id);
    console.log("tpe of id", typeof id);

    if(!id) {
        return res.json({success: false , message  : "Id not recieved"})
    }

    try {
        const deleteList = await Listmodel.findOne({movieid : id});

        if(!deleteList) {
            return res.json({success: true , message : "would not find id in the database"})
        }
        
        const deletedList = await Listmodel.deleteOne({movieid : id});

        if(deletedList) {
            return res.json({success: true , message : "deleted successfully"})

        }

    }

    catch(error) {
        res.json({success: false , message : error.message })
    }


} 