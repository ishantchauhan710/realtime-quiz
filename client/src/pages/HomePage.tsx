import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/auth";

export default function Home({ setUser }: any) {
  const [user, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const API = "http://localhost:3333";

  // 🔥 Fetch user
  const fetchMe = async () => {
    const token = getToken();

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const res = await fetch(API + "/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        clearToken();
        window.location.href = "/";
        return;
      }

      setLocalUser(data);
      setUser(data);
      setName(data.name);
    } catch {
      clearToken();
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // 🔥 Avatar helper
  const getAvatar = () => {
    if (preview) return preview;

    if (!user?.profilePictureUrl) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.name || "User"
      )}`;
    }

    return user.profilePictureUrl.startsWith("http")
      ? user.profilePictureUrl
      : `${API}${user.profilePictureUrl}`;
  };

  
  const handleUpdateProfile = async () => {
    const token = getToken();
    setSaving(true);

    try {
      const res = await fetch(API + "/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setLocalUser(data.user);
        setUser(data.user);
      }
    } finally {
      setSaving(false);
    }
  };

  // 🖼️ Upload avatar
  const handleUploadAvatar = async () => {
    if (!file) return;

    const token = getToken();
    const formData = new FormData();
    formData.append("avatar", file);

    setSaving(true);

    try {
      const res = await fetch(API + "/profile/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setLocalUser((prev: any) => ({
          ...prev,
          profilePictureUrl: data.avatar, // ✅ correct
        }));
        setPreview(null); // clear preview after upload
        handleUpdateProfile(); // refresh profile to get new avatar URL
      }
    } finally {
      setSaving(false);
    }
  };

  // 🔐 Logout
  const handleLogout = async () => {
    const token = getToken();

    await fetch(API + "/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>

        <nav className="flex flex-col gap-4 text-gray-300">
          <span className="hover:text-white cursor-pointer">Profile</span>
          <span className="hover:text-white cursor-pointer">Settings</span>
          <span className="hover:text-white cursor-pointer">Stats</span>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="text-gray-400 text-sm">Manage your account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">

            <img
              src={getAvatar()}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.name || "User"
                  )}`;
              }}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 mb-4"
            />

            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>

            {/* Upload */}
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f)); // 🔥 preview
                }
              }}
              className="mt-4 text-sm"
            />

            <button
              onClick={handleUploadAvatar}
              disabled={saving}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
            >
              {saving ? "Uploading..." : "Update Picture"}
            </button>
          </div>

          {/* Edit Profile */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h3 className="text-lg font-semibold mb-6">Edit Profile</h3>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-400">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  value={user?.email}
                  disabled
                  className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 opacity-60"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}