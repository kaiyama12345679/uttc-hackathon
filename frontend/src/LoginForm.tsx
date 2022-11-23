import React from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
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
        alert(errorMessage);
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
      <button onClick={signInWithGoogle}>
        Googleでログイン
      </button>
      <button onClick={signOutWithGoogle}>
        ログアウト
      </button>
    </div>
  );
};