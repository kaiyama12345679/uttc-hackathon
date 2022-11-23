import React, { useEffect } from "react";
import {Link, Router} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { userInfo } from "./App";
import {createContext} from "react";
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { AuthCredential, onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import MDSpinner from "react-md-spinner";
import { LoginForm } from "./LoginForm";
import Avatar from '@mui/material/Avatar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dividerClasses } from "@mui/material";
import { FmdBadTwoTone, Http } from "@mui/icons-material";
import {URL} from "./App";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const options = {

  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: '総獲得ポイント一覧',
      font: {size: 30},
    },
    labels: {
      font: {size: 30},
    }
  },
};

type Props = {
    Info: userInfo[]
    loginUser: any
}

type UserDetail = {
  id: string,
  name: string,
  email_address: string,
  photo_url: string
};


export const UserId = createContext("");
const TopPage = (props: Props) => {
    const navigate = useNavigate();

    const [authUser, setAuthUser] = React.useState<UserDetail | undefined >(undefined);
    const [authCnd, setAuThCnd] = React.useState<string>("認証していません");

    useEffect(() => {
      const confirm = async () => {
        console.log("fetch")
        const response = await fetch(
          URL + "/toppage",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              props.loginUser?props.loginUser.email:"hoge"
            )
          }
        );
        const res_status = response.status;
        console.log("response", response.status);
        if (res_status == 500) {
          setAuThCnd("問題が発生しました．もう一度やり直してください");
        } else if (res_status == 409) {
          setAuThCnd("重複したユーザーが存在します．システムの管理者に問い合わせてください")
        } else if (res_status == 204) {
          setAuThCnd("ユーザが見つかりません．サインアップから登録をお願いいたします。");
        } else {
          setAuthUser(await response.json());
          setAuThCnd("ログイン済");
          console.log("authUser",authUser);
        }
      };
      if (props.loginUser == null) {
        setAuThCnd("認証していません");
        setAuthUser(undefined);
      } else {
        confirm();
      }
      }
    , [props.loginUser]);

    if (props.Info == null ) {
        return (
            <MDSpinner size={100}/>
        )
    }

    
    const onSubmit = (submit: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (authUser != undefined) {
        navigate("/user", {state: {id: authUser.id, name: authUser.name, email: authUser.email_address, photo_url: authUser.photo_url}})
      }
    };

    const MyBar = () => {
      const labels = props.Info.map((info) => info.name);
    const data = {
      labels,
      datasets: [
        {
          data: props.Info.map((info) => info.points),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ], 
    }
    return (
      <Bar data={data} options={options} />
    )    
    }

    const ToUserPage = () => {
      if (authUser == undefined) {
        return (
        <LoginForm />
        )
      } else {
        return (
          <div>
            <LoginForm />
          <Avatar src={authUser.photo_url} style={{margin: "auto"}}/>
          <h3><b>{authUser.name}</b>さん，こんにちは</h3>
          <h4>Googleアカウント名: {props.loginUser?props.loginUser.displayName:""}</h4>
          <h4>Gmailアドレス: {authUser.email_address}</h4>
          <Button size="large" variant="contained" color="success" onClick={onSubmit}>ユーザーページへ</Button>
          </div>
        ) 
    }};
    
    const UserList = () => {
      return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
  {props.Info.map((user) => (
    <ListItem
      key={user.id}
      disableGutters={false}
    >
      <Avatar src={user.photo_url}/>
      <ListItemText primary={user.name} />
      <a href={"mailto:" + user.email_address}>メールはこちら</a>
    </ListItem>
  ))}
</List> )};
    return (
      <Box>
        <h1>トップページ</h1>
        <h3>ユーザー一覧</h3>
          <UserList/>
        <Button size="large"  component={Link} to="/signup" variant="contained" >
            サインアップ
        </Button>
        <br/>
        <h3>{authCnd}</h3>
        <ToUserPage/>
        <MyBar />
      </Box>
    )
  };

export default TopPage;
