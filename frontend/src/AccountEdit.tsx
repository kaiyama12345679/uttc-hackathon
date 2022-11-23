import React from "react";
import Button from "@mui/material/Button";
import {URL} from "./App"
import {Box} from "@mui/material";
import { useLocation , useNavigate} from "react-router-dom";
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import {Link} from "react-router-dom";
import {state} from "./User";

type Props = {
    loginUser: any
}
const AccountEdit = (props: Props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const messageState = location.state as state;
    const [new_name, setNew_name] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);
    const myInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNew_name(e.target.value as string);
    };

    if (props.loginUser == null || props.loginUser.email != messageState.email) {
        document.location.href = "/";
        return (
            <div>遷移中</div>
        )
    }
    const onBackChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        navigate("/user", {state: messageState});
    };

    const onNameChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (new_name == "") {
            alert("名前を入力してください");
            return;
        }
        setLoading2(true);
        const response = await fetch(
            URL + "/user/account-edit",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: messageState.id,
                    new_name: new_name,
                }),
            }
        );
        setLoading2(false);
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

    const onDeleteChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        var ans = window.confirm("本当にアカウントを削除しますか?");
        if (!ans) {
            return;
        }
        var ans = window.confirm("この操作は取り消せません．本当に削除しますか?");
        if (!ans) {
            return;
        }
        setLoading(true);
        const response = await fetch(
            URL + "/user/account-edit",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    messageState.id,
                ),
            }
        );
        setLoading(false);
        const resStatus = response.status;
        if (resStatus == 200) {
            alert("ユーザーを削除しました");
            document.location.href = "/";
        } else {
            alert("ユーザーの削除に失敗しました. もう一度やり直してください");
        }
    };
    return(
        <div>
        <Box>
            <h1>アカウント名の編集</h1>
            <h3>現在のアカウント名: {messageState.name}</h3>
            <TextField fullWidth id="filled-basic" label="新しいアカウント名を入力" variant="filled" value={new_name} onChange={myInputChange} />
            <h2 style={{color: "blue"}}>新しいアカウント名: {new_name}</h2>
            <LoadingButton onClick={onNameChange} variant="contained" color="success" loading={loading2}>アカウント名の変更</LoadingButton>
            <br />
        </Box>
        <Box>
            <LoadingButton onClick={onDeleteChange} variant="contained" size="large" color="error" loading={loading} startIcon={<DeleteIcon />}>アカウントを削除</LoadingButton>
        </Box>
        <Button onClick={onBackChange} variant="contained">ユーザ画面に戻る</Button>
        </div>
        
    )
}

export default AccountEdit;