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
import { onAuthStateChanged } from "firebase/auth";
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
}

type UserDetail = {
  id: string,
  name: string,
  email_address: string,
  photo_url: string
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
export const UserId = createContext("");
const TopPage = (props: Props) => {
    const navigate = useNavigate();

    const [loginUser, setLoginUser] = React.useState(fireAuth.currentUser);
    const [authUser, setAuthUser] = React.useState<UserDetail | undefined>(undefined);

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
              loginUser?loginUser.email:"hoge"
            )
          }
        );
        const res_status = response.status;
        console.log("response", response.status);
        if (res_status == 500) {
          alert("問題が発生しました．もう一度やり直してください")
        } else if (res_status == 409) {
          alert ("重複したユーザが見つかりました")
        } else if (res_status == 204) {
          alert("ユーザが見つかりません．サインアップから登録をお願いいたします。")
        } else {
          setAuthUser(await response.json());
          console.log("authUser",authUser);
        }
      };
      confirm();
      }
    , [loginUser]);

    if (props.Info == null ) {
        return (
            <MDSpinner size={100}/>
        )
    }

    onAuthStateChanged(fireAuth, user => {
      setLoginUser(user);
    });
    const onSubmit = async (id: string, name: string) => {
      if (authUser != undefined) {
        navigate("/user", {state: {id: authUser.id, name: authUser.name}})
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
          <Link to="/user" state={{id: loginUser}}>ユーザーページへ</Link>
          <Avatar src={authUser.photo_url}/>
          </div>
        ) 
      } 
    }
    
    const UserList = () => {
      return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
  {props.Info.map((user) => (
    <ListItem
      key={user.id}
      disableGutters={false}
    >
      <ListItemText primary={user.name} />
    </ListItem>
  ))}
</List> )};
    return (
      <Box>
        <h1>トップページ</h1>
          <UserList/>
        <Button size="large"  component={Link} to="/signup" variant="contained">
            サインアップ
        </Button>
        <br/>
        <ToUserPage/>
        <MyBar />
      </Box>
    )
  };

export default TopPage;
