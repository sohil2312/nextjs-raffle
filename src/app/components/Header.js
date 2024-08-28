"use client" // top to the file
import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

const Header = () => {
    const { enableWeb3, account, isWeb3Enabled,Moralis,deactivateWeb3} = useMoralis()
    useEffect(() => {
        if(!isWeb3Enabled &&
          typeof window != "undefined"&&
          window.localStorage.getItem("connected")){
            enableWeb3()
          }
    }, [isWeb3Enabled])
    useEffect(() => {
      Moralis.onAccountChanged((newAccount)=>{
        console.log(`Account changed to ${newAccount}`);
        if(newAccount == null){
          window.localStorage.removeItem("connected")
          deactivateWeb3();
          console.log("NULL account found")
        }
      })
    }, [])
    
    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 4)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button onClick={
                  async () => {await  enableWeb3()
                if(typeof window !== "undefined"){
                  window.localStorage.setItem("connected","injected")
                }}}>Connect</button>
            )}
        </div>
    )
}

export default Header
