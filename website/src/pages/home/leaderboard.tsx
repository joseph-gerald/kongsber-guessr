import LeaderboardItem from "./components/LeaderboardItem";

export default function Leaderboard({ onClick, leaderboard }: { onClick: any, leaderboard: any }) {
    // LeaderboardItem | username, xp, logo
    return (
        <>
            <div onClick={onClick} className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <div className="circle hidden sm:inline-block">
                    <img src="/imgs/mesh.png" alt="" />
                </div>

                <div className="absolute sm:bg-black/50 backdrop-blur-md rounded-3xl px-3.5 py-[26px]">
                    <div className="flex justify-between m-7">
                        <div className="flex items-center flex-col">
                            <h2 className="clash-display font-bold text-6xl text-white/70 mb-6">Top Players</h2>
                            <h2 className="clash-display text-xl text-white/70 mb-6">Top 4 KongsberGuessrs</h2>
                            <div className="flex flex-col sm:flex-row gap-10 w-full justify-center">
                                {!leaderboard ? "Loading..." : leaderboard.length == 0 ?
                                    <h1 className="clash-display font-bold text-7xl text-white/70 mx-[127px] my-12">
                                        Loading...
                                    </h1>
                                    : leaderboard.map((user: any, index: any) => (
                                        <LeaderboardItem
                                            username={user.username}
                                            xp={user.xp}
                                            rank={index}
                                            key={index}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
