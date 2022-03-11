import { Axios } from 'axios';
//import { response } from 'express';
import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";

function LoginPage(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
       
        setEmail(event.currentTarget.value)
    
    }

    const onPasswordHandler = (event) => {
       
        setPassword(event.currentTarget.value)
    
    }

    const onSubmitHandler = (event) => {
       
        event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

        //console.log('Email', Email);
        //console.log('Password', Password);

        let body = {
            email : Email,
            password : Password
        }

       
        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess){
                navigate(-1);
                //props.history.push("/") //페이지 이동
            }
            else { 
                alert("error");
            }
        });

        Axios.post('/api/user/login', body)
        .then(response => {});
    
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{display:'flex', flexDirection:'column'}}
                  onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <br/>
                <button>
                    Login
                </button>

            </form>

        </div>
    
    )
}

export default LoginPage