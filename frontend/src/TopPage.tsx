import React, { useEffect } from "react";
import {Link, Router} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { userInfo } from "./App";
import {createContext} from "react";
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:8000/api";
let cnt = 0;
type Props = {
    Info: userInfo[]
}
export const UserId = createContext("");
const TopPage = (props: Props) => {
    const navigate = useNavigate();
    if (props.Info == null ) {
        return (
            <div>not readed</div>
        )
    }
    const onSubmit = async (id: string, name: string) => {
      console.log("onSubmit");
      navigate("/user", {state: {id: id, name: name}});
      console.log("cnt: " + cnt);
    };
    
    const UserList = () => {
      return (
        <div className="userList">
      {props.Info.map((user) => {
        return (
          <Box className="user" key={user.id}
          sx={{
            width: "100%",
            backgroundColor: 'primary.dark',
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
         >
          <span key={user.id}>
            <h2>名前:{user.name}</h2>
            <Button   color="secondary" variant="contained" onClick={() => onSubmit(user.id, user.name)}>ユーザー選択</Button>
          </span>
        </ Box>  
      )})}
      </div>)};
    return (
      <div >
        <h1>トップページ</h1>
        <div className='userList'>
          <UserList/>
        </div>
        
        <Button  component={Link} to="/tameshi" variant="contained">
            Link
        </Button>
      </div>
    )
  };

export default TopPage;
