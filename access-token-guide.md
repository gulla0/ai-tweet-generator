# How to Set Up Twitter/X App with OAuth 1.0a and Get All Required Tokens

This guide walks you through setting up an X (Twitter) app with **Read and Write** permissions and obtaining the following credentials for OAuth 1.0a:

- API Key (Consumer Key)
- API Key Secret (Consumer Secret)
- Access Token
- Access Token Secret

---

## ✅ Step-by-Step Setup

### 1. Create a New App
- Go to [developer.twitter.com](https://developer.twitter.com/) and log in.
- Create a new project and then a new app.
- After the app is created, copy the **API Key** and **API Key Secret** (these are available immediately after creation).

### 2. Set App Permissions (Required Before Token Generation)
- In the app settings, go to **User authentication settings**.
- Set the following:
  - **App permissions:** `Read and write`
  - **Type of App:** `Web App, Automated App or Bot`
  - **Callback URI / Redirect URL:** `http://127.0.0.1:3000/callback`
  - **Website URL:** `https://example.com`
- Save the settings.

### 3. Generate Access Token and Access Token Secret
- Go to the **Keys and Tokens** section of your app.
- Under **Access Token and Secret**, click **Generate**.
- Copy your:
  - **Access Token**
  - **Access Token Secret**

---

## ⚠️ Important Notes
- You **must** set permissions to "Read and Write" **before** generating Access Token & Secret.
- If you change permissions later, regenerate the tokens.

Done! You now have everything needed to use OAuth 1.0a with the Twitter API.
