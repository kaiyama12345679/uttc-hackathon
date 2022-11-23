import React from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import Button from "@mui/material/Button";
import { fireAuth } from "./firebase";


export const LoginForm: React.FC = () => {
  /**
   * googleでログインする
   */
  const signInWithGoogle = (): void => {
    // Google認証プロバイダを利用する
    const provider = new GoogleAuthProvider();
    

    // ログイン用のポップアップを表示
    signInWithPopup(fireAuth, provider)
      .then(res => {
        console.log("ResUser", res.user);
      })
      .catch(err => {
        const errorMessage = err.message;
      });
  };

  /**
   * ログアウトする
   */
  const signOutWithGoogle = (): void => {
    signOut(fireAuth).then(() => {
      alert("ログアウトしました");
    }).catch(err => {
      alert("エラーが発生しました:" + err);
    });
  };

  return (
    <div>
      <Button variant="contained" color="info" size="large" onClick={signInWithGoogle}>
        Googleでログイン
      </Button>
      <Button onClick={signOutWithGoogle} variant="contained" color="error" size="small">
        ログアウト
      </Button>
    </div>
  );
};