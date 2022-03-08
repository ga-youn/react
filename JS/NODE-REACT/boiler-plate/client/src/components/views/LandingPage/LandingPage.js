import React, {useEffect} from 'react';
import axios from 'axios';


function LandingPage() {

    useEffect(() => {
        axios.get("/api/hello") //서버 전송
        .then(response => console.log(response.data))
    }, [])
    
    return (
        <div>
            랜딩페이지
        </div>
    
    )
}

export default LandingPage