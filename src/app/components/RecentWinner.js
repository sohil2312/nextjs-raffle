import React from "react"

const RecentWinner = ({ recentWinner }) => {
    return (
        <div className="m-10 flex flex-auto justify-center p-4 text-xl text-blue-800">
            <p>Recent Winner:<span className="text-red-600">{recentWinner}</span></p>
        </div>
    )
}

export default RecentWinner
