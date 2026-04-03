import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";
import PageContainer from "./PageContainer";

export default function Leaderboard({ user, setUser }: any) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3333";

  const getAvatar = (player: any) => {
    if (!player.profilePictureUrl) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        player.name || "User"
      )}`;
    }

    return player.profilePictureUrl.startsWith("http")
      ? player.profilePictureUrl
      : `${API}${player.profilePictureUrl}`;
  };

  const fetchLeaderboard = async () => {
    const token = getToken();

    try {
      const res = await fetch(API + "/leaderboard/global", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLeaderboard(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Leaderboard</h1>
        <p className="text-gray-400 text-sm">
          Top players ranked by total wins
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">
            Loading leaderboard...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800 text-left text-sm text-gray-400">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Wins</th>
                <th className="p-4">Solo</th>
                <th className="p-4">Multi</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={player.userId}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  {/* Rank */}
                  <td className="p-4 font-semibold">
                    #{player.rank}
                  </td>

                  {/* Player */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={getAvatar(player)}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                    <span className="font-medium">{player.name}</span>
                  </td>

                  {/* Stats */}
                  <td className="p-4 font-semibold">
                    {player.totalWins}
                  </td>

                  <td className="p-4 text-gray-400">
                    {player.soloWins}
                  </td>

                  <td className="p-4 text-gray-400">
                    {player.multiWins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageContainer>
  );
}