#!/bin/bash
npm install -g appwrite-cli
appwrite -v
appwrite login --endpoint http://localhost/v1

# I don't think this is needed anymore because appwrite.json handles this

# appwrite init project
# appwrite databases create --database-id "groupr_db" --name "GrouPR Database"
# appwrite databases create-collection --database-id "groupr_db" --collection-dd "chat_messages" --name "Chat Messages"
# appwrite databases create-string-attribute --database-id "groupr_db"  --collection-id "chat_messages" --key "userId" --size 50 --required true
# appwrite databases create-string-attribute --database-id "groupr_db"  --collection-id "chat_messages" --key "message" --size 250 --required true
# appwrite databases create-string-attribute --database-id "groupr_db"  --collection-id "chat_messages" --key "userName" --size 50 --required true