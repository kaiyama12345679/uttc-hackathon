import React from "react";
import { useState } from "react";
import {Link} from "react-router-dom";

const Login = () => {
    const [tweet, setTweet] = useState("");

    const myChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTweet(e.target.value);
    };
    return (
        <div className="LoginForm">
            <h1>入力</h1>
            <input type="text"  value = {tweet} placeholder="文章を入力" onChange={myChange}/>
            <h1>{tweet}</h1>
            <Link to = "/">戻る</Link>
        </div>
    )
};

export default Login;



