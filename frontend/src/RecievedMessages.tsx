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
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MDSpinner from "react-md-spinner";
import { userInfo } from "./App";
import SubmitForm from "./post/MessagePost";
import Container from '@mui/material/Container';
import "./App.css";
import { message, state } from "./User";
import { useLocation } from "react-router-dom";
import {URL} from "./App";
type Props = {
    users: userInfo[],
}
var messages: message[];



const RecievedMessage = (props: Props) => {
    const [changing, setChanging] = useState<boolean>(false);
    const [Messages, setMessages] = useState<message[]>([]);
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
                setChanging(true);
              const get = async () => {
                const response = await fetch(
                  URL + "/recieved",
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
                setMessages(messages);
                resStatus = response.status;
                setUpdate(update? false: true);
                setChanging(false);
              };
              get();
            }, []);
    if (changing == true) {
        return (
            <MDSpinner size={100}/>
        );
    }
    return (
        <div>
            {Messages.map((message: message) => {
                const from_user = props.users.find((user) => user.id == message.from_id);
            return (
                <Accordion  key={message.id} expanded={expanded === message.id} onChange={handleAcChange(message.id)}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                ?????????: 
                <Avatar src={from_user?from_user.photo_url:""}/><b>{from_user?from_user.name:""}</b>????????????
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}><b>{message.point}</b>????????????????????????????????????</Typography>
            <Typography sx={{ color: 'text.secondary' }}>??????:<b>{message.posted_time}</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                <h3>{message.message}</h3>
            </Typography>
            </AccordionDetails>
        </Accordion>)
            })}
        </div>)
}; 

export default RecievedMessage;