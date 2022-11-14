import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { AppBar } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { userInfo } from "./App";
import SubmitForm from "./post/MessagePost";
import Container from '@mui/material/Container';
import "./App.css";
import { useLocation } from "react-router-dom";
import { message, state } from "./User";
const URL = "http://localhost:8000/user/to";
var messages: message[];

type Props = {
    users: userInfo[],
}

const SubmitMessage = (props: Props) => {
    const get = async () => {
        const response = await fetch(
          URL,
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
        messages = await response.json();
        resStatus = response.status;
        console.log("submitresStatus: " + resStatus);
        setUpdate(update?false:true);
      };

    const location = useLocation();
    const messageState = location.state as state;
    const [update, setUpdate] = useState<boolean>(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [isClicked, setIsClicked] = React.useState<string | false>(false);
    const [tmp, setTmp] = useState<JSX.Element>()
    let resStatus: number;
    const handleAcChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        };


    const onDelete = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, mid: string) => {
        console.log("delete start");
        const response = await fetch(
            URL, 
            {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mid)
        }
        );
        const res_status: number = response.status;
        if (res_status == 200){
            alert("削除が完了しました")
              get();
        } else{
            alert("削除に失敗しました　もう一度やり直して下さい")
        }
    }
    const onEditChange = (panel: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("Mid is", panel)
        setIsClicked(isClicked? panel:false);
        setUpdate(update?false:true);
        if (update) {
            setTmp(<h1>hogehoge</h1>);
        } else {
            setTmp(<h1>foofoo</h1>);
        }
    }

    useEffect(
        () => {
          get();
        }, []);

    useEffect(
        () => {
            console.log("fmt");
        }
    , [isClicked]);
    if (messages === undefined) {
        return (
            <div>
                <h1>メッセージはありません</h1>
            </div>
        );
    }
    return (
        <div>
            {messages.map((message: message) => {
                const to_user = props.users.find((user) => user.id == message.to_id);
                const To = () => {
                    if (to_user === undefined) {
                        return "loading"
                    }
                    else {
                        return to_user.name
                    }
                };
                const EditConsole = () => {
                    if (isClicked == message.id) {
                        console.log("open id is", message.id);
                        return (
                            <div>hogehoge</div>
                        )
                    } else {
                        return (
                            <div>foofoo</div>
                        )
                    }
                }
            return (
                <Accordion  key={message.id} expanded={expanded === message.id} onChange={handleAcChange(message.id)}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                送信先: <b>{To()}</b>さんに
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}><b>{message.point}</b> ポイントを贈りました！</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                メッセージ: {message.message}
            </Typography>
            <Button variant="outlined" color="success" onClick={onEditChange(message.id)}>編集</Button>
            <Button variant="outlined" color="error" onClick={(e) => onDelete(e, message.id)}>削除</Button>
            </AccordionDetails>
            {tmp}
        </Accordion>)
            })}
        </div>)
}; 

export default SubmitMessage;