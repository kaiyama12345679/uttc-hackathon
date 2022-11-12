import React from "react";
import { useEffect } from "react";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
const URL = "";
import {useLocation} from "react-router-dom";
type state = {
    id: string
}
const UserProfile = () => {
    const location = useLocation();
    const messageState = location.state as state;
    return (
        <div>
            <h1>ユーザープロファイル</h1>
            <p>{messageState.id}</p>
        <Button  component={Link} to="/" variant="contained">
            Link
        </Button>
        </div>
    )
};

export default UserProfile