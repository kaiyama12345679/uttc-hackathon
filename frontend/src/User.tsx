import React from "react";
import { useEffect } from "react";

const UserProfile = () => {

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
    return (
        <div></div>
    )
};