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

type Props = {
    users: userInfo[],
}
const URL = "http://localhost:8000/user/message";
const SubmitForm = (props: Props) => {
    const [toid, setToid] = useState<string>("");
    const [point, setPoint] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const handleNameChange = (event: SelectChangeEvent) => {
        setToid(event.target.value as string);
    };

    const myInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value as string);
    };

    const location = useLocation();
    const nowuser = location.state as state;
    const onSubmit = () => {
        
    }
    console.log("toid is " + toid);

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

    

    return (
        <Box>
        <h2>感謝したい相手は誰ですか？</h2>
        <UserList />
        <h3>感謝の気持ちを伝えましょう！</h3>
        <TextField fullWidth id="filled-basic" label="メッセージを入力" variant="filled" value={message} onChange={myInputChange} />
        </Box>   
    )
    };    

export default SubmitForm;