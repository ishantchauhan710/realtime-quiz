import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../lib/auth";

export default function GoogleSuccess({ setUser }: any) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

useEffect(() => {
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");

  if (accessToken) {
    setToken(accessToken);

    // optional: store refresh token
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    fetch("http://localhost:3333/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        navigate("/home");
      });
  } else {
    navigate("/");
  }
}, []);

  return <div>Logging you in...</div>;
}