import { ethers } from "ethers"
import React from "react"

const EnterComponents = ({ numPlayers, balance, recentWinner}) => {
    return (
        <div>
            <div className="playersBal m-10 flex flex-auto justify-between p-4 text-xl text-blue-800">
                <p>Number of players:{numPlayers}</p>
                <p>Balance in Contract:{ethers.formatEther(balance)}</p>
            </div>
           

            
        </div>
    )
}

export default EnterComponents
