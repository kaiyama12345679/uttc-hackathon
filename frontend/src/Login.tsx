import React from "react";
import { useState } from "react";
import {Link} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = () => {
    const [tweet, setTweet] = useState("");

    const myChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTweet(e.target.value);
    };
    return (
        <div className="LoginForm">
            <h1>入力</h1>
            <TextField id="filled-basic" placeholder="文章を入力" variant="filled" value={tweet} onChange={myChange}/>
            <h1>{tweet}</h1>
            <Button component={Link} to="/" variant="contained">
            Link
          </Button>
        </div>
    )
};

export default Login;



