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
import Login from "./Login";
import TopPage from "./TopPage";
const URL = "http://localhost:8000/api";
type userInfo = {
  id: string,
  name: string,
  age: number,
}
let Info: userInfo[];
function App() {
  const [tmp, setTmp] = useState("")
  const [luser, setLuser] = useState("");
  useEffect(
    () => {
      const get = async () => {
        console.log("init");
        const response = await fetch(
          URL,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const info: userInfo[] = await response.json();
        console.log("readed");
        Info = info;
        console.table(Info);
        setTmp(tmp + "_");
      }
      get();
    }, []);
    
    const Header = () => {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                へっだー
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </Box>
      );
    }
    
  
  return (
    <div>
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<TopPage  Info={Info}/>} />
        <Route path = "/tameshi" element = {<Login />}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
