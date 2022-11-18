import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { dividerClasses, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import "./App.css";
import { useLocation } from "react-router-dom";
import { message, state } from "./User";
import Slider from "@mui/material/Slider";
import SendIcon from '@mui/icons-material/Send';
import {URL} from "./App"
type Props = {
    isClicked: boolean | string,
    message: message,
    setSubmitMessages: React.Dispatch<React.SetStateAction<message[]>>,
    setIsClicked: React.Dispatch<React.SetStateAction<boolean | string>>,
    setIsedit: React.Dispatch<React.SetStateAction<string>>,
}

const OnEditChange = (props: Props) => {

    const location = useLocation();
    const messageState = location.state as state;
    const [loading, setLoading] = React.useState(false);

    const get = async () => {
        const response = await fetch(
          URL + "/user/submitted",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
                messageState.id
            )
          }
        );
        const  messages = await response.json();
        props.setIsClicked(!props.isClicked);
        props.setIsedit("投稿の編集");
        props.setSubmitMessages(messages);
      };


    
    const [message, setMessage] = useState<string>("");
    const [point, setPoint] = useState<number>(1);
    const myInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value as string);
    };
    const myPointChange = (e: Event, v:any) => {
        if (e.target != null) {
            setPoint(v);
        }
}
const pointMark = [
    {value: 1, label: 'Min'},
    {value: 500, label: 'Max'},
];

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true);
        const response = await fetch(
          URL + "/user/submitted",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    id: props.message.id,
                    point: point,
                    message: message,
                }
            )
          }
        );
        setLoading(false);
        const resStatus = response.status;
        if (resStatus === 200) {
            alert("更新しました");
            get();
        } else {
            alert("更新に失敗しました 時間をおいて再度お試しください");
        }
      };
    useEffect(() => {setMessage(props.message.message);
                    setPoint(props.message.point)}, [props.isClicked]);      
    if (props.isClicked) {
        return (
            <div>
                <Box>
                <h3>ポイント数を編集</h3>
                <Slider min={1} max={500} marks={pointMark} value={point} aria-label="Default" valueLabelDisplay="auto"  onChange={myPointChange}/>
                <h4>{point}ポイント？</h4>
                <h3>メッセージの編集</h3>
                <TextField fullWidth id="filled-basic" label="メッセージを入力" variant="filled" value={message} onChange={myInputChange} />
                </Box>
                <Box>
                <LoadingButton variant="contained" color="warning" size="medium" endIcon={<SendIcon/>} onClick={onSubmit} loading={loading} >
                    修正の完了
                    </LoadingButton>
                </Box>
            </div>  
        )
    } else {
        return (
            <></>
        )
    }
}
export default OnEditChange;