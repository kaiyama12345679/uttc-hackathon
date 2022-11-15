import React from "react";
import Button from "@mui/material/Button";
import {URL} from "./App"
import {Box} from "@mui/material";
import { useLocation , useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
import {Link} from "react-router-dom";
import {state} from "./User";
const AccountEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const messageState = location.state as state;
    const [new_name, setNew_name] = React.useState<string>("");
    const myInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNew_name(e.target.value as string);
    };
    const onBackChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        navigate("/user", {state: messageState});
    };

    const onNameChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (new_name == "") {
            alert("名前を入力してください");
            return;
        }
        const response = await fetch(
            URL + "/user/account-edit",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: messageState.id,
                    name: new_name,
                }),
            }
        );
        const resStatus = response.status;
        if (resStatus == 200) {
            messageState.name = new_name;
            alert("ユーザー名を変更しました");
            navigate("/user", {state: messageState});
        } else if (resStatus == 409){
            alert("そのユーザー名は既に使用されています");
        } else {
            alert("名前の変更に失敗しました. もう一度やり直してください");
        }
    };
    return(
        <div>
            <Box>
            <h1>アカウント名の編集</h1>
            <h3>現在のアカウント名: {messageState.name}</h3>
            <TextField fullWidth id="filled-basic" label="新しいアカウント名を入力" variant="filled" value={new_name} onChange={myInputChange} />
            <h2 style={{color: "blue"}}>新しいアカウント名: {new_name}</h2>
            <Button onSubmit={onNameChange} variant="contained" color="success">アカウント名の変更</Button>
            <Button onClick={onBackChange}>ユーザ画面に戻る</Button>
        </Box>
        </div>
        
    )
}

export default AccountEdit;