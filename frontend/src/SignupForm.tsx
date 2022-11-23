import React from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import { AuthCredential, onAuthStateChanged } from "firebase/auth";
import LoadingButton from '@mui/lab/LoadingButton';
import {URL} from "./App";
import { fireAuth } from "./firebase";
import Avatar from '@mui/material/Avatar';
import {LoginForm} from "./LoginForm";
import UserProfile from "./User";

type NewUser = {
    name: string | undefined
    email_address: string | null
    photo_url: string | null
}

const SignUpForm = () => {
    const [newName, setNewName] = useState("");
    const [loginUser, setLoginUser] = React.useState(fireAuth.currentUser);
    const [loading, setLoading] = useState(false);
    onAuthStateChanged(fireAuth, u => {
        setLoginUser(u);
      });
    const onSubmit = async (submit: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            console.log("post start");
            if (newName == "") {
                alert("ユーザー名は一文字以上必要です");
                return;
            }
            const ans: boolean = window.confirm("ユーザー名は" + newName + "でよろしいですか？");
            if (!ans) {
                return;
            }
            if (loginUser == null) {
                alert("Googleアカウントでログインしてください。")
                return
            }
            setLoading(true);
            const tmp: NewUser = {name: newName, email_address: loginUser.email, photo_url: loginUser.photoURL}
            
            const response = await fetch(
                URL + "/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(tmp),
                }
            );
            setLoading(false);
            const res_status: number =  response.status;
            console.log(res_status);
            if (res_status == 200) {
                alert("登録が完了しました");
                document.location.href = "/";
            } else if(res_status == 409) {
                alert("そのGoogle Accountはすでに使われています");
            } else if (res_status == 412) {
                alert("そのユーザー名はすでに使われています")
                setNewName("");
            } 
            else {
                alert("エラーが発生しました．時間をおいて再度お試しください");
            }
            console.log("post end");   
}

    const myChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };
    const UserProfile = () => {
        if (loginUser == null) {
            return (
                <h3>Googleアカウントでログインしてください</h3>
            )
        } else {
            return (
                <div>
                    <div>
                    <Avatar src={loginUser.photoURL?loginUser.photoURL:""}/>
                    </div>
                    <h4>Googleアカウント名:{loginUser.displayName}</h4>
                    <h4>Gmailアドレス: {loginUser.email}</h4>
                </div>            )
        }
    }
    return (
        <div>
            <LoginForm/>
            <UserProfile/>
        <div className="SignUpForm">
            <h1>ユーザー名の登録</h1>
            <TextField id="filled-basic" label="登録するユーザー名を入力" placeholder="神座出流" variant="filled" value={newName} onChange={myChange}/>
            <h2>登録するユーザー名:<b>{newName}</b></h2>
            <LoadingButton variant="contained" color="inherit" size="large" loading={loading} endIcon={<SendIcon/>} onClick={onSubmit}>
                ユーザーの登録
                </LoadingButton>
        </div>
        <Button component={Link} to="/" variant="contained">
        トップページに戻る
      </Button>
      </div>
    )
};

export default SignUpForm;



