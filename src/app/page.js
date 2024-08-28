"use client" // top to the file
import Image from "next/image"
import Header from "./components/Header"
import { MoralisProvider } from "react-moralis"
import { ConnectButton, NotificationProvider } from "web3uikit"
import RaffleEntrace from "./components/RaffleEntrace"

export default function Home() {
    return (
        <>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                <div className="headerTab flex flex-auto m-2 justify-between border-2 p-3 
                rounded-xl">
                <h1 className="text-3xl">Decentralized lottery</h1>
                    <ConnectButton moralisAuth={false} />
                </div>
                   
                    <RaffleEntrace />
                </NotificationProvider>
            </MoralisProvider>
        </>
    )
}
