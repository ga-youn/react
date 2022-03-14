import React, {useEffect} from 'react';
import axios from 'axios';
//import { response } from 'express';
import { useNavigate } from "react-router-dom";


function LandingPage() {

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/hello") //서버 전송
        .then(response => console.log(response.data))
    }, [])

    const onClickHandler = () => {
        axios.get("/api/user/logout")
        .then(response => {
            if(response.data.success){
                navigate("/login");
            }else{
                alert("로그아웃 하는데 실패했습니다.");
            }
        })

    }
    
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <h2>시작페이지</h2>
       
            <div>
                <button onClick={onClickHandler}>
                 로그아웃
                </button>
            </div>
            

        </div>

    
    )
}

export default LandingPage