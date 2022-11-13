import * as React from "react";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import {message} from "../User";
import { userInfo } from "../App";
import {state} from "../User";
import {useLocation} from "react-router-dom";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
type Props = {
    users: userInfo[],
}

type submitMessage = {
    from_id: string,
    to_id: string,
    point: number,
    message: string,
}
const URL = "http://localhost:8000/user/message";
const SubmitForm = (props: Props) => {
    const [toid, setToid] = useState<string>("");
    const [point, setPoint] = useState<number>(1);
    const [message, setMessage] = useState<string>("");
    const handleNameChange = (event: SelectChangeEvent) => {
        setToid(event.target.value as string);
    };

    const myInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value as string);
    };

    const myPointChange = (e: Event, v:any) => {
        if (e.target != null) {
            setPoint(v);
        }
    };
    const location = useLocation();
    const nowuser = location.state as state;
    const onSubmit = async (submit: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (toid == "") {
            alert("相手のユーザーを選択してください");
            return;
        }
        const theMessage: submitMessage = {from_id: nowuser.id, to_id: toid, point: point, message: message};

        
            console.log("post start");
            const response = await fetch(
                URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(theMessage),
                }
            );
            const res_status: number =  response.status;
            console.log(res_status);
            if (res_status == 200) {
                alert("送信が完了しました");
                setToid("");
                setPoint(1);
                setMessage("");
            } else {
                alert("送信に失敗しました もう一度やり直してください");
            }
            console.log("post end");   
}

    const UserList = () => {
        if (props.users.length === 0) {
            return (<div>ユーザーがいません</div>);
        }
        {
           return (<Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
            <InputLabel  id="demo-simple-select-label">送信先の選択</InputLabel>
            </FormControl>
           <Select
           fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={toid}
            label="送信先"
            onChange={handleNameChange}
          >
            {props.users.map((user) => {
        if (user.id != nowuser.id) {
            return (<MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)
        }})}
          </Select>
          </Box>
            
    )}}; 
    const pointMark = [
        {value: 1, label: 'Min'},
        {value: 500, label: 'Max'},
    ];

    

    return (
        <div>
            <Box>
            <h2>感謝したい相手は誰ですか？</h2>
            <UserList />
            <h3>どれだけ感謝したいですか？</h3>
            <Slider min={1} max={500} marks={pointMark} value={point} aria-label="Default" valueLabelDisplay="auto"  onChange={myPointChange}/>
            <h4>{point}ポイント？</h4>
            <h3>感謝の気持ちを伝えましょう！</h3>
            <TextField fullWidth id="filled-basic" label="メッセージを入力" variant="filled" value={message} onChange={myInputChange} />
            </Box>
            <Box>
            <Button variant="contained" color="inherit" size="large" endIcon={<SendIcon/>} onClick={onSubmit}>
                メッセージを送る
                </Button>
            </Box>
        </div>   
    )
    };    

export default SubmitForm;