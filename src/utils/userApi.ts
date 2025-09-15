import axios from "axios";
import { SERVER_BASE_URL } from "../config/server";
import Cookies from "js-cookie";

// bas url för user api
const BASE_URL = `${SERVER_BASE_URL}/api/users`;

type user ={
    userName: string;
    password:string;
}

// här är alla api anrop för user

export async function registerNewUser(newUser:user){
    try{
        const rep = await axios.post(`${BASE_URL}/register`, newUser)
        return {success: true, data: rep.data};
    }
    catch(e){
        console.error("Error creating user:", e);
        return{success: false, error:e};
    }


}

export async function loginUser(login:user){
    try {
        const rep = await axios.post(`${BASE_URL}/login`, login);
        if (rep.data.token) {
            Cookies.set("currentUser", rep.data.token);
        }
        return { success: true, data: rep.data };
    } catch (e) {
        console.error("Error logging in user:", e);
        return { success: false, error: e };
    }

}




export async function getAllUsers(){
    try{
        const rep = await axios.get(`${BASE_URL}`)
        return {success: true, data: rep.data};
    }
    catch(e){
        console.error("Error creating user:", e);
        return{success: false, error:e};
    }

}