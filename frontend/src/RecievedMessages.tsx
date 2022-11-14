import  * as React from "react";
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
import { message, state } from "./User";
import { useLocation } from "react-router-dom";

var messages: message[];
type Props = {
    users: userInfo[],
}

const URL = "http://localhost:8000/user";

const RecievedMessage = (props: Props) => {

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
                messages = [];
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
                const from_user = props.users.find((user) => user.id == message.from_id);
                const From = () => {
                    if (from_user === undefined) {
                        return "loading"
                    }
                    else {
                        return from_user.name
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
                贈り主: <b>{From()}</b>さんから
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}><b>{message.point}</b>ポイントが贈られました！</Typography>
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

export default RecievedMessage;