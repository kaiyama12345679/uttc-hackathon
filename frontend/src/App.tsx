import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import SignUpForm from "./SignupForm";
import TopPage from "./TopPage";
import UserProfile from "./User";
import AccountEdit from "./AccountEdit";
export const URL = "https://uttc-hackathon-v3glk6ae6a-uc.a.run.app/";

export type userInfo = {
  id: string,
  name: string,
  points: number,
}

let Info: userInfo[];
function App() {
  const [update, setUpdate] = useState<boolean>(false);
  const [users, setUser] = useState<userInfo[]>([]);
  useEffect(
    () => {
      const get = async () => {
        const response = await fetch(
          URL + "/toppage",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const info: userInfo[] = await response.json();
        Info = info;
        setUser(info);
        console.table(Info);
        setUpdate(update? false: true);
      }
      get();
    }, []);

    
    
    const Header = () => {
      return (
        <Box sx={{ width: "100%"}} >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                へっだー
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      );
    }
    
  
  return (
    <div className='App'>
      <Header  />
      <BrowserRouter>
      <Routes >
        <Route path = "/" element = {<TopPage  Info={Info}   />} />
        <Route path = "/signup" element = {<SignUpForm />}/>
        <Route path = "/user" element = {<UserProfile  users = {users} />}/>
        <Route path = "/user/account-edit" element = {<AccountEdit />}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}
export default App;
