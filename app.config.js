require('dotenv').config();

export default{
  "expo": {
    "name": "GrouPR",
    "slug": "groupr",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "extra": {
      "eas": {
        "projectId": "75dec1dd-3a52-4a86-b0fd-04625d10fc13"
      }
    },
    "owner": "ryanpickrel",
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.API_KEY,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    }
  }
}
