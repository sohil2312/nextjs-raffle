import React, { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import abi from "../constants/abi.json"
import contractAddresses from "../constants/contractAddresses.json"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import EnterComponents from "./EnterComponents"
import RecentWinner from "./RecentWinner"

const RaffleEntrace = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainIdInt = parseInt(chainIdHex, 16)
    const raffleAddress = chainIdInt in contractAddresses ? contractAddresses[chainIdInt][0] : null
    const dispatch = useNotification()

    const [numPlayers, setNumPlayers] = useState(0)
    const [balance, setBalance] = useState(0)
    const [recentWinner, setRecentWinner] = useState("0")
    const [isTransactionLoading, setisTransactionLoading] = useState(false)

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
        onSuccess,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: 10000000000000000,
    })
    const { runContractFunction: getPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getPlayers",
        params: {},
    })

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getBalance",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const numberOfPlayers = (await getPlayers()).length
        const currentBalance = (await getBalance()).toString()
        const recentWinnerCall = (await getRecentWinner()).toString()

        setRecentWinner(recentWinnerCall)
        setNumPlayers(numberOfPlayers)
        setBalance(currentBalance)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
            if (raffleAddress) {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const contract = new ethers.Contract(raffleAddress, abi, provider)
                contract.on("winnerPicked", (winner) => {
                    console.log(winner)
                    setRecentWinner(winner)
                    updateUI()
                    const handleWinnerNotification = async () => {
                        dispatch({
                            type: "success",
                            message: `Winner is ${winner}`,
                            title: "Winner Picked",
                            position: "topR",
                        })
                    }
                    handleWinnerNotification()
                    return () => {
                        contract.removeAllListeners("winnerPicked")
                    }
                })
            }
        }
    }, [isWeb3Enabled, raffleAddress])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNotification()
        updateUI()
        setisTransactionLoading(false)
        console.log(isFetching)
        console.log(isLoading)
    }
    const handleNotification = async () => {
        dispatch({
            type: "success",
            message: "trx completed",
            title: "trx info",
            position: "topR",
        })
    }

    const handleEnterRaffle = async () => {
        setisTransactionLoading(true)
        await enterRaffle({
            onSuccess: handleSuccess,
            onError: () => setisTransactionLoading(false),
        })
    }

    return (
        <>
            {raffleAddress ? (
                <div>
                    <EnterComponents
                        numPlayers={numPlayers}
                        balance={balance}
                        recentWinner={recentWinner}
                    />
                    <div className="enterbutton flex flex-auto justify-center">
                        <button
                            onClick={handleEnterRaffle}
                            className="bg-blue-200 p-5 rounded-xl hover:bg-blue-800 hover:text-white"
                            disabled={isTransactionLoading}
                        >
                            {isTransactionLoading ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "ENTER //RAFFLE"
                            )}
                        </button>
                    </div>
                    <RecentWinner recentWinner={recentWinner} />
                </div>
            ) : (
                <div>No address detected</div>
            )}
        </>
    )
}

export default RaffleEntrace
