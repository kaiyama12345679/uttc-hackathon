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

    const location = useLocation();
    const messageState = location.state as state;
    const [update, setUpdate] = useState<boolean>(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    let resStatus: number;
    const handleAcChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        };

    useEffect(
        () => {
            resStatus = 0;
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
            setUpdate(update? false: true);
          };
          get();
        }, []);

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
                }
            return (
                <Accordion  key={message.id} expanded={expanded === 'panel1'} onChange={handleAcChange('panel1')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                送信先: {To()
            }さんに
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{message.point}ポイントを贈りました！</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                メッセージ: {message.message}
            </Typography>
            </AccordionDetails>
        </Accordion>)
            })}
        </div>)
}; 

export default SubmitMessage;