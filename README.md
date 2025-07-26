# 💪GrouPR

## ✅Prerequistes

1. Visit the official Node.js website: https://nodejs.org

1. Download the Node.js installer suitable for your operating system (Windows, macOS, or Linux).

1. Run the installer and follow the on-screen instructions to complete the installation. I have v22.17.1 installed (07/26/2025).

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

Install the Expo Go app on your iOS or Android phone and connect to the same wireless network as your computer. On Android, use the Expo Go app to scan the QR code from your terminal to open your project. On iOS, use the built-in QR code scanner of the default iOS Camera app.

## 📱How to Run an Android Emulator

1. Install Android Studio: https://developer.android.com/studio
2. I had java version: openjdk 17.0.16 2025-07-15 installed. Install link: https://adoptium.net/en-GB/temurin/releases/?version=17 android studio might install java for you.
3. Open Android Studio:
   - Go to Tools > Device Manager
   - Click “Create Device”
   - Choose a device type
   - Select a system image (pick one with “Play Store” if possible)
   - Finish setup.  