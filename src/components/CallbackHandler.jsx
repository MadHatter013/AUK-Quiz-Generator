import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "./config";

export const getAuthToken = () => sessionStorage.getItem("authToken");
export const getUserEmail = () => sessionStorage.getItem("userEmail");

const CallbackHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const authCode = urlParams.get("code");

        if (authCode) {
            console.log("Authorization Code:", authCode);

            const exchangeCodeForToken = async (code) => {
                const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
                const clientId = "06d23a88-f337-42e4-a8b2-77ab433ab50d";
                const redirectUri = config.redirectUri;
                const codeVerifier = localStorage.getItem("code_verifier");

                if (!codeVerifier) {
                    console.error("Code verifier not found in localStorage");
                    return;
                }

                const params = new URLSearchParams({
                    client_id: clientId,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                });

                try {
                    const response = await fetch(tokenUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: params.toString(),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Error exchanging code for token:", errorText);
                        return;
                    }

                    const tokenData = await response.json();
                    console.log("Token Data:", tokenData);

                    const serverResponse = await fetch("https://quality-owl-simply.ngrok-free.app/auth/microsoft_graph/api_callback", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(tokenData),
                    });

                    if (!serverResponse.ok) {
                        const serverErrorText = await serverResponse.text();
                        console.error("Error sending token to server:", serverErrorText);
                        return;
                    }

                    const serverResponseData = await serverResponse.json();
                    console.log("Server Response:", serverResponseData);

                    if (serverResponseData.token_type && serverResponseData.auth_token) {
                        const authToken = `${serverResponseData.token_type} ${serverResponseData.auth_token}`;
                        sessionStorage.setItem("authToken", authToken);
                        console.log("Auth Token saved to sessionStorage:", authToken);

                        if (serverResponseData.user?.email) {
                            sessionStorage.setItem("userEmail", serverResponseData.user.email);
                        }
                    } else {
                        console.error("Invalid server response: Missing token_type or auth_token");
                    }

                    navigate("/quizzes");
                } catch (error) {
                    console.error("Error during token exchange or server communication:", error);
                }
            };

            exchangeCodeForToken(authCode);
        } else {
            console.error("Authorization code not found");
        }
    }, [navigate]);

    return <div>Processing authorization...</div>;
};

export default CallbackHandler;
