import axios from "axios";
import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER
} from "./types";

//로그인 action
export function loginUser(dataToSubmit){

    const request = axios.post('/api/user/login', dataToSubmit)
    .then(response => response.data)

    return {
        type : LOGIN_USER,
        payload : request
    }

}

//회원가입 action
export function registerUser(dataToSubmit){//post는 바디부분이 필요하다

    const request = axios.post('/api/user/register', dataToSubmit)
    .then(response => response.data)

    return {
        type : REGISTER_USER,
        payload : request
    }

}

//사용자별 권한 action
export function auth(){
                                //get은 바디부분이 필요없다
    const request = axios.get('/api/user/auth')
    .then(response => response.data)

    return {
        type : AUTH_USER,
        payload : request
    }

}