# 💪GrouPR

## ✅Prerequistes

1. Visit the official Node.js website: https://nodejs.org

1. Download the Node.js installer suitable for your operating system (Windows, macOS, or Linux).

1. Run the installer and follow the on-screen instructions to complete the installation. I have **v22.17.1** installed (07/26/2025).

1. Once you have Node.js installed, npx will be available globally on your system. You can verify the installation by opening a terminal or command prompt and typing:
```bash
npx -v
```
This command will display the version of npx if it is installed correctly.

Note: If you already have Node.js installed and npx is not available, it might be due to an older version of Node.js. In that case, you can update Node.js to the latest version by downloading and running the installer from the Node.js website.

## ✈️How to Run

```bash
npm install
npx expo start
```

[Go to Database Setup](#Databases)


Install the Expo Go app on your iOS or Android phone and connect to the same wireless network as your computer. On Android, use the Expo Go app to scan the QR code from your terminal to open your project. On iOS, use the built-in QR code scanner of the default iOS Camera app.

## 🛢Databases
Still contemplating what is the best to run Firebase vs. Appwrite


## 📝Appwrite 
Download Docker on your system: https://www.docker.com/products/docker-desktop/
```bash
cd appwrite
```

Start the Appwrite stack using the following Docker command:
### Start
```bash
docker compose up -d --remove-orphans
```

Once the Docker installation completes, go to your machine's hostname or IP address on your browser to access the Appwrite Console. Please note that on hosts that are not Linux-native, the server might take a few minutes to start after installation completes.

## DB One Time Setup
Make sure you go the UI setup first to make a login at: localhost 

Install the appwrite-cli globally, ensure it is installed correctly, login, and push out my config
```bash
npm install -g appwrite-cli
appwrite -v
appwrite login --endpoint http://localhost/v1
appwrite run??? (or sub the projectId it gives you)
./appwrite-run.sh push all
```
./appwrite-run.sh command (use from now on)

### Stop
You can stop your Appwrite containers by using the following command executed from the same directory as your docker-compose.yml file.

```bash
docker compose stop
```

### Uninstall
To stop and remove your Appwrite containers, you can use the following command executed from the same directory as your docker-compose.yml file.

```bash
docker compose down -v
```

## 🔥How to Set Up Firebase (Depreciated) 
```bash
firebase emulators:start
```
Set up right now to NOT keep any data around #TODO fix in future

## 📱How to Run an Android Emulator

1. Install Android Studio: https://developer.android.com/studio
2. I had java version: openjdk **17.0.16 2025-07-15** installed. Install link: https://adoptium.net/en-GB/temurin/releases/?version=17 android studio might install java for you.
3. Open Android Studio:
   - Go to More Actions > Virtual Device Manager
   - Click “Create Virtual Device”
   - Choose a device type
   - Select a system image (pick one with “Play Store” if possible I am using Medium Phone API 36.0)
   - Finish setup.  