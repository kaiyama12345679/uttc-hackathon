import React from "react";
import {Link} from "react-router-dom";

type Props = {
    id: string
    name: string
    point: number
};

const UserList = (props: Props) => {
    return (
        <div>
            {props.id.length < 1 ? (
                <div>no items</div>
    ): (
        <div>there are items</div>
    )}
        </div>
    );
};