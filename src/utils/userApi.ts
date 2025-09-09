import axios from "axios";


const BASE_URL = "http://localhost:8080/api/users";

type user ={
    userName: string;
    password:string;
}

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
    try{
        const rep = await axios.post(`${BASE_URL}/login`, login)
        return {success: true, data: rep.data};
    }
    catch(e){
        console.error("Error creating user:", e);
        return{success: false, error:e};
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