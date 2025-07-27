import { Client, Account, Databases } from 'react-native-appwrite';
import { IP_ADDRESS, APPWRITE_PROJECT_ID } from '@env';
import { Platform } from 'react-native';

const client = new Client();

const hostname = Platform.OS === 'android' ? '10.0.2.2' : IP_ADDRESS;

client
  .setEndpoint(`http://${hostname}/v1`) 
  .setProject(APPWRITE_PROJECT_ID);       


const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };