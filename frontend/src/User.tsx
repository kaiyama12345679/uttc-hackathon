import React from "react";
import { useEffect } from "react";
const URL = ""

type Props = {
    luid: string
}
const UserProfile = (props: Props) => {
    console.log("luid is:", props.luid)
    return (
        <div>{props.luid}</div>
    )
};

export default UserProfile