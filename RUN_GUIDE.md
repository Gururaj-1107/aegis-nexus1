# Local Development Guide (Docker)

If you do not have Docker or PostgreSQL experience, follow this step-by-step guide to run the **Aegis Nexus** ecosystem locally on your laptop without any complicated setups!

## prerequisites

1. **Install Docker Desktop (Crucial Step)**
   - Since you don't have Docker installed, you must get it first.
   - Go to: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Download the installer for Windows and run it.
   - Restart your machine if Docker prompts you to.
   - Open Docker Desktop and let the engine initialize. Keep this application running in the background!

2. **Configure Your API Keys (Step-by-Step)**

   API Keys are like passwords that let your app speak to Google. You need three specific keys to make the platform work locally. 

   **How to get the keys:**
   
   *   **`GEMINI_API_KEY`**: 
       *   **Link**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
       *   **Steps**: Go to the link, sign in, click "Create API Key" and generate one. Copy it.

   *   **`GOOGLE_CLIENT_ID`** (For Authentication):
       *   **Link**: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
       *   **Steps**: Go to the Google Cloud Console. Click "Create Credentials" -> "OAuth client ID". Choose "Web application", and copy the Client ID it gives you.

   *   **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`**:
       *   **Link**: [https://console.cloud.google.com/google/maps-apis/api-list](https://console.cloud.google.com/google/maps-apis/api-list)
       *   **Steps**: In Google Cloud Console, enable the "Maps JavaScript API". Then go to Credentials, generate a Maps API Key, and copy it.

   **Where to put the keys:**
   
   Now that you have your keys, you need to save them. Open the following files in your editor:
   
   1. Open **`e:\Google\services\backend\.env`** (create this file if it doesn't exist by renaming `.env.example`).
      Paste this inside:
      ```env
      PORT=3001
      DATABASE_URL="postgresql://aegis:password123@db:5432/aegisnexus"
      MATCHER_URL="http://cpp_matcher:8080"
      GEMINI_API_KEY=PASTE_YOUR_GEMINI_KEY_HERE
      GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
      ```
   
   2. Open **`e:\Google\services\frontend\.env.local`** (create this file if it doesn't exist by renaming `.env.local.example`).
      Paste this inside:
      ```env
      NEXT_PUBLIC_API_URL=http://localhost:3001
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=PASTE_YOUR_MAPS_KEY_HERE
      ```

   Once those keys are saved inside those two files, your app is fully connected to Google!

## Running the Container Ecosystem

Because this is automated through `docker-compose.yml`, you do not need to install Postgres or Node locally on your laptop natively (aside from NextJS which runs in its container).

1. **Open your Terminal (Command Prompt or PowerShell)**
2. Navigate to your project folder:
   ```cmd
   cd e:\Google
   ```
3. Boot the environment automatically:
   ```cmd
   docker compose up --build
   ```

*(This command will pull the raw Postgres image, build the C++ server from source inside a Linux VM, map everything seamlessly, and start Node and Next.js! It may take 3-5 minutes the first time it downloads the images).*

## Accessing the Apps

Once the terminal stops scrolling wildly and shows `🚀 Aegis Nexus Backend running on port 3001` and NextJS compiling successfully:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Node.js Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

## Preparing to Export / Send

If you need a perfect ZIP file (without exposing keys or massive node dependencies) to deploy on Google Cloud Run later:

1. Look for `zip_project.js` which we wrote for you.
2. In your terminal, run `npm install archiver` (if not installed) then:
   ```cmd
   node zip_project.js
   ```
3. A file called `AegisNexus_Ready.zip` will appear. Send this!
