import { Client, Account, Databases, Permission, Role, Query, ID, Teams } from 'react-native-appwrite';
import { IP_ADDRESS, APPWRITE_PROJECT_ID } from '@env';
import { Platform } from 'react-native';

const client = new Client();

const hostname = Platform.OS === 'android' ? '10.0.2.2' : IP_ADDRESS;

client
  .setEndpoint(`http://${hostname}/v1`)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);

const DATABASE_ID = 'groupr_db';

const COLLECTIONS = {
  CHAT_MESSAGES: 'chat_messages',
};

export { client, account, databases, teams, Permission, Role, Query, ID, DATABASE_ID, COLLECTIONS };