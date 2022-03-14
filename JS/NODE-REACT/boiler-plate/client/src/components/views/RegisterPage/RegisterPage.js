import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";

function RegisterPage(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => { 
        setEmail(event.currentTarget.value)  
    }

    const onNameHandler = (event) => { 
        setName(event.currentTarget.value)  
    }

    const onPasswordHandler = (event) => {   
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {   
      setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {   
        event.preventDefault(); //안하면 페이지가 refresh되므로 막아주려고 사용.

        //console.log('Email', Email);
        //console.log('Password', Password);

        //password와 confirm password가 일치할때만 가입승인
        if(Password !== ConfirmPassword){
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body = {
            email : Email,
            name : Name,
            password : Password
        }

        //redux를 사용함으로 axios는 사용안한다.
        //Axios.post('/api/user/register', body)
        //.then(response => {});

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success){
                navigate("/login");
                //props.history.push("/login") //페이지 이동
            }
            else { 
                alert("Failed to sign up");
            }
        });

        
    
    }

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{display:'flex', flexDirection:'column'}}
                  onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>

                <br/>
                <button>
                    회원가입
                </button>

            </form>

        </div>
  )
}

export default RegisterPage