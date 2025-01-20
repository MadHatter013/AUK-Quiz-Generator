import React from "react";

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

const MicrosoftAuth = () => {
    const clientId = "06d23a88-f337-42e4-a8b2-77ab433ab50d";
    const redirectUri = "http://localhost:3000/auth/microsoft_graph/callback"; 
    const authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

    const handleLogin = async () => {

        const authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
        const clientId = "06d23a88-f337-42e4-a8b2-77ab433ab50d";
        const redirectUri = encodeURIComponent("http://localhost:3000/auth/microsoft_graph/callback");
        const codeVerifier = generateRandomString(128);
        localStorage.setItem("code_verifier", codeVerifier);
        
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        const params = new URLSearchParams({
            client_id: clientId,
            response_type: "code",
            redirect_uri: redirectUri,
            response_mode: "query",
            scope: "openid email profile User.Read",
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
            state: generateRandomString(16),
        });
        
        window.location.href = `${authUrl}?${params.toString()}`;
        
    };

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
