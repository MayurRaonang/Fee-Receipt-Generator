import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import BASE_URL from "../assets/assets";

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token){
        console.error("No token found");
        return setIsValid(false);
      }
      try {
        const res = await fetch(`${BASE_URL}/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // console.log("Token validation response:", data);
        setIsValid(data.valid);
      } catch {
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) return null; // or loading spinner

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
