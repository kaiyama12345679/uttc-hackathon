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
export type message = {
    id: string,
    from_id: string,
    to_id: string,
    point: number,
    message: string,
};

type Props = {
    users: userInfo[],
}

var messages : message[];

const URL = "http://localhost:8000/user";
import {useLocation} from "react-router-dom";
import { UserId } from "./TopPage";

export type state = {
    id: string
    name: string
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const UserProfile = (props: Props) => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const [update, setUpdate] = useState<boolean>(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleAcChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    };
    const location = useLocation();
    const messageState = location.state as state;
    useEffect(
        () => {
            console.log(messageState.id);
          const get = async () => {
            console.log("message init");
            const response = await fetch(
              URL,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                //   "userid": messageState.id,
                },
                body: JSON.stringify(
                    messageState.id
                )
              }
            );
            messages = await response.json();
            console.log("message readed");
            console.log("the message:", messages);
            setUpdate(update? false: true);
          };
          get();
        }, []);

        const RecievedMessage = () => {
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
                        console.log("from_user", from_user);
                        const from = () => {
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
                        贈り主: {from()
                    }さんから
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{message.point}ポイントが贈られました！</Typography>
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
    return (
        <Box sx={{  width: "100%" }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
        >
          <Tab label="受け取ったメッセージ一覧"  />
          <Tab label="送ったメッセージ一覧"  />
          <Tab label="送信フォーム"  />
        </Tabs>
      </AppBar>


        <TabPanel value={value} index={0} dir={theme.direction}>
          <div>
            <h1>ユーザー情報</h1>
            <p>ユーザーID: {messageState.id}</p>
            <p>ユーザー名: {messageState.name}</p>
            <RecievedMessage />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
            <SubmitForm users={props.users}/>
        </TabPanel>
        <Button component={Link} to="/" variant="contained">
            最初のページに戻る
          </Button>
    </Box>
    )
};

export default UserProfile