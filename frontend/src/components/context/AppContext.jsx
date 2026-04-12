import axios from "axios";
import { createContext , useEffect, useState } from "react";

export const AppContent = createContext()

export const AppContextProvider = (props)=> {

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [userData , setuserData] = useState();
    const [user, setUser] = useState();
    // const [Searchdata , setSearchdata] = useState();

    console.log("this is appcontext data",userData);
    useEffect(() => {
        const userAuth =  async () => {
            let res = await axios.get(backend_url + '/api/user/getuser', {withCredentials: true});
            console.log("data from userdata api",res.data);
            if(res.data.success){
                setUser(res.data.userdata)
            }
            else{
                console.log("user not found or unauthorised");
            }
            

        }
      
            userAuth();
        
       

    },[])


    const value = {
        backend_url,
        userData,
        setuserData,
        user,
        setUser
        // Searchdata,
        // setSearchdata

    }

    return (
        <AppContent.Provider value={value} >
            {props.children}

        </AppContent.Provider>
    )

}