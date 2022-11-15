import React from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import {URL} from "./App";

const SignUpForm = () => {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (submit: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            console.log("post start");
            if (user == "") {
                alert("ユーザー名は一文字以上必要です");
                return;
            }
            const ans: boolean = window.confirm("ユーザー名は" + user + "でよろしいですか？");
            if (!ans) {
                return;
            }
            setLoading(true);
            
            const response = await fetch(
                URL + "/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                }
            );
            setLoading(false);
            const res_status: number =  response.status;
            console.log(res_status);
            if (res_status == 200) {
                alert("登録が完了しました");
                document.location.href = "/";
            } else if(res_status == 409) {
                alert("そのユーザー名はすでに使われています");
                setUser("");
            } else {
                alert("エラーが発生しました．時間をおいて再度お試しください");
            }
            console.log("post end");   
}

    const myChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    };
    return (
        <div>
        <div className="SignUpForm">
            <h1>ユーザー名の登録</h1>
            <TextField id="filled-basic" label="登録するユーザー名を入力" placeholder="神座出流" variant="filled" value={user} onChange={myChange}/>
            <h2>登録するユーザー名:<b>{user}</b></h2>
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



