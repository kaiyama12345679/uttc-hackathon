import React from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const URL = "http://localhost:8000/api";
type userInfo = {
    id: string,
    name: string,
    age: number,
  }
type Props = {
    Info: userInfo[]
}
const TopPage = (props: Props) => {
    if (props.Info == null ) {
        return (
            <div>not readed</div>
        )
    }
    const onSubmit = async (submit: React.MouseEvent<HTMLButtonElement, MouseEvent>, userId: string) => {
      submit.preventDefault();

      const response = await fetch(
        URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application-json"
          },
          body: JSON.stringify(
            userId
          )
        }
      );
      console.log("response status:", response.status);
      
    }
    
    const userList = props.Info.map((user) => {
        return (
          <Box
          sx={{
            width: 200,
            height: 100,
            backgroundColor: 'primary.dark',
            '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          <div key={user.id}>
            <p>名前:{user.name}</p>
            <p>年齢:{user.age}</p>
            <Button component={Link} to="/user" variant="contained"></Button>
          </div>
        </ Box>  
      )});
    return (
      <div>
        <h1>トップページ</h1>
        <ul>
        <div className='userList'>
          {userList}
        </div>
        </ul>
        <Button component={Link} to="/tameshi" variant="contained">
            Link
        </Button>
      </div>
    )
  };

export default TopPage;
