import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { dividerClasses, TextField, Typography } from "@mui/material";
import { AppBar } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { userInfo } from "./App";
import SubmitForm from "./post/MessagePost";
import Container from '@mui/material/Container';
import "./App.css";
import { useLocation } from "react-router-dom";
import { message, state } from "./User";
import Slider from "@mui/material/Slider";
import SendIcon from '@mui/icons-material/Send';
import OnEditChange from "./EditChange";
import DeleteIcon from '@mui/icons-material/Delete';
import MDSpinner from "react-md-spinner";
import {URL} from "./App";
var messages: message[];

type Props = {
    users: userInfo[],
}


const SubmitMessage = (props: Props) => {
    const [SubmitMessages, setSubmitMessages] = useState<message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [changing, setChanging] = useState<boolean>(false);
    const get = async () => {
        setChanging(true);
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
        messages = await response.json();
        setSubmitMessages(messages);
        resStatus = response.status;
        console.log("submitresStatus: " + resStatus);
        setUpdate(update?false:true);
        setChanging(false);
      };

    const location = useLocation();
    const messageState = location.state as state;
    const [update, setUpdate] = useState<boolean>(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [isClicked, setIsClicked] = React.useState<boolean | string>(false);
    const [isedit, setIsedit] = React.useState<string>("???????????????");
    let resStatus: number;
    const handleAcChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        setIsClicked(false);
        setIsedit("???????????????");
        };


    const onDelete = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, mid: string) => {
        console.log("delete start");
        const ans = window.confirm("??????????????????????????????");
        if(!ans){
            return;
        }
        setLoading(true);
        const response = await fetch(
            URL + "/user/submitted", 
            {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mid)
        }
        );
        setLoading(false);
        const res_status: number = response.status;
        if (res_status == 200){
            alert("???????????????????????????")
              get();
        } else{
            alert("??????????????????????????????????????????????????????????????????")
        }
    }
    

    const onChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsClicked(!isClicked);
        if (!isClicked) {
            setIsedit("????????????????????????");
        } else {
            setIsedit("???????????????");
        }
    }

    useEffect(
        () => {
          get();
        }, []);
    if (changing) {
        return (
            <MDSpinner size={100}/>
        );
    }
    return (
        <div>
            {SubmitMessages.map((message: message) => {
                const to_user = props.users.find((user) => user.id == message.to_id);
                
            return (
                <Accordion  key={message.id} expanded={expanded === message.id} onChange={handleAcChange(message.id)}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                ?????????: <Avatar src={to_user?to_user.photo_url:""}/><b>{to_user?to_user.name:""}</b>?????????
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}><b>{message.point}</b> ?????????????????????????????????</Typography>
            <Typography sx={{ color: 'text.secondary' }}>??????:<b>{message.posted_time}</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                <h3>{message.message}</h3>
            </Typography>
            <Button variant="outlined" color="success" onClick={onChange}>{isedit}</Button>
            <LoadingButton variant="contained" color="error" startIcon={<DeleteIcon />} loading={loading} onClick={(e) => onDelete(e, message.id)}>???????????????</LoadingButton>
            </AccordionDetails>
            <OnEditChange isClicked={isClicked} message={message} setSubmitMessages={setSubmitMessages} setIsClicked={setIsClicked} setIsedit={setIsedit}/>
        </Accordion>)
            })}
        </div>)
}; 

export default SubmitMessage;