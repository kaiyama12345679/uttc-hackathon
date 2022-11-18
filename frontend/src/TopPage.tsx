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
      text: '総獲得ポイント',
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
export const UserId = createContext("");
const TopPage = (props: Props) => {
    const navigate = useNavigate();

    const [loginUser, setLoginUser] = React.useState(fireAuth.currentUser);
    if (props.Info == null ) {
        return (
            <MDSpinner size={100}/>
        )
    }

    onAuthStateChanged(fireAuth, user => {
      setLoginUser(user);
      console.log(user);
    });
    const onSubmit = async (id: string, name: string) => {
      navigate("/user", {state: {id: id, name: name}});
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
      if (loginUser == null) {
        return (
        <LoginForm />
        )
      } else if (loginUser.photoURL != null){
        return (
          <div>
            <LoginForm />
          <Link to="/user" state={{id: loginUser}}>ユーザーページへ</Link>
          <img src={loginUser.photoURL} alt="" />
          </div>
        ) 
      } else {
        return (
          <div>
            <LoginForm />
          <Link to="/user" state={{id: loginUser}}>ユーザーページへ</Link>
          </div>
        )
      }
    };
    
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
