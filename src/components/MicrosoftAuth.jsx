import React, { useEffect } from "react";
import config from "./config";

function generateRandomString(length) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function exchangeCodeForToken(authCode, codeVerifier) {
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const clientId = "06d23a88-f337-42e4-a8b2-77ab433ab50d"; 
    const redirectUri = config.redirectUri;

    const params = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    if (!response.ok) {
        console.error("Failed to exchange code for token:", await response.text());
        return null;
    }

    const tokenData = await response.json();
    console.log("Token Data:", tokenData);
    return tokenData;
}


const MicrosoftAuth = () => {
    const clientId = "06d23a88-f337-42e4-a8b2-77ab433ab50d";
    const redirectUri = config.redirectUri;

    const authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

    const handleLogin = async () => {
        const codeVerifier = generateRandomString(128);
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem("code_verifier", codeVerifier);

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: "code",
            redirect_uri: redirectUri,
            response_mode: "query",
            scope: "openid profile email offline_access",
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        });

        window.location.href = `${authUrl}?${params.toString()}`;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");

        if (authCode) {
            const codeVerifier = localStorage.getItem("code_verifier");
            if (codeVerifier) {
                exchangeCodeForToken(authCode, codeVerifier);
            } else {
                console.error("Code verifier not found in localStorage");
            }
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Microsoft OAuth 2.0 с PKCE</h1>
            <button
                onClick={handleLogin}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#0078D4",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Авторизоваться
            </button>
        </div>
    );
};

export default MicrosoftAuth;
