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

    const { userid ,movieid, moviename , imageurl , language} = req.body;
    // console.log(userid,movieid, moviename , imageurl , language);

    if(!moviename ) {
        return res.json({success:false , message: "movie name is required"})
    }

    try{
        if(!userid) {
            return res.json({success:false , message : "useridid can not be found"})
        }

        if(!movieid) {
            return res.json({success:false , message : "movieid can not be found"})
        }

        const insertList = await Listmodel.findOne({userid : userid , movieid : movieid});

        if(insertList) {
            return res.json({success : false , message : "already added"})
        }
        
        const newlist = await new Listmodel({userid,movieid,moviename,imageurl,language} )

        await newlist.save();
        
        return res.json({success: true , message : "added to the database"})
    }

    catch(error) {
        res.json({success : false , message : error.message})
    }
}

export const deleteList = async (req,res) => {

    // const { id }  = req.params.id;
    const { userid ,movieid } = req.body;


    console.log("this is userid from delete route",userid);
    console.log("tpe of id", typeof id);

    if(!userid) {
        return res.json({success: false , message  : "userId not recieved"})
    }

    if(!movieid) {
        return res.json({success: false , message  : "movieid not recieved"})
    }

    try {
        const deleteList = await Listmodel.findOne({userid : userid , movieid : movieid});

        if(!deleteList) {
            return res.json({success: true , message : "would not find userid or movie id in the database"})
        }
        
        const deletedList = await Listmodel.deleteOne({userid : userid , movieid : movieid});

        if(deletedList) {
            return res.json({success: true , message : "deleted successfully"})

        }

    }

    catch(error) {
        res.json({success: false , message : error.message })
    }


} 