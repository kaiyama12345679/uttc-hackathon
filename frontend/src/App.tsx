import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import { BrowserRouter , Routes, Route, Link} from 'react-router-dom';
import Login from "./Login"
const URL = "sample";
function App() {


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
        const info = await response.json();
        console.log("readed");
      }
    }
  );
  const Hoge = () => {
    return (
      <div>
        <h1>トップページ</h1>
        <div>
          <h1>ユーザーリスト</h1>

        </div>
        <Link to = "/tameshi">tameshi</Link>
      </div>
    )
  };
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Hoge />} />
        <Route path = "tameshi" element = {<Login />}/>
      </Routes>
    </BrowserRouter>
    <div>
      <h1>下の要素</h1>
    </div>
    </div>
  );
}

export default App;
