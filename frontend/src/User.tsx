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
import SubmitMessage from "./SubmitMessages";
import RecievedMessage from "./RecievedMessages";
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    };
    const location = useLocation();
    const messageState = location.state as state;

        
    return (
        <Box sx={{  width: "100%" }}>
            <Container  sx={{ bgcolor: '#cfe8fc'}}  className="User_Header">
                こんにちは，<b>{messageState.name}</b>さん
            </Container>
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
            <RecievedMessage users={props.users}/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <SubmitMessage users={props.users}/>
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