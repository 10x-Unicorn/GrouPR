require('dotenv').config();

export default{
  "expo": {
    "name": "GrouPR",
    "slug": "groupr",
    "version": "1.0.0",
    "scheme": "groupr",
    // IDK if we need this, for web
    "web": {
      "bundler": "metro"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
     "ios": {
      "bundleIdentifier": "com.10xu.groupr",
      "associatedDomains": ["applinks:groupr.com"] // Optional: for universal links
    },
    "android": {
      "package": "com.10xu.groupr",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "groupr.com"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
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
      measurementId: process.env.MEASUREMENT_ID,
      ipAddress: process.env.IP_ADDRESS
    }
  }
}
