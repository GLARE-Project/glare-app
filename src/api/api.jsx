import { Client as Appwrite, Databases, Account, Storage, Permission, Role } from "appwrite";

import { Server } from "../utils/config";

let api = {
  sdk: null,

  provider: () => {

    if (api.sdk) {
      return api.sdk;
    }

    let appwrite = new Appwrite();
    appwrite.setEndpoint(Server.endpoint).setProject(Server.project);

    const database = new Databases(appwrite);
    const account = new Account(appwrite);
    const storage = new Storage(appwrite);

    api.sdk = { database, account, storage };
    return api.sdk;
  },
 
  createAccount: (email, password, name) => {
    return api.provider().account.create("unique()", email, password, name);
  },

  getAccount: () => {
    return api.provider().account.get();
  },

  // updatePassword: (password) => {
  //   return api.provider().account.updatePassword(password);
  // },

  createRecovery: (email, url) => {
    //let url1 = Server.endpoint;
    return api.provider().account.createRecovery(email, url + '/resetPassword');
  },
  
  updateRecovery: (userId, secret, password, paswordAgain) => {
    return api.provider().account.updateRecovery(userId, secret, password, paswordAgain);
  },
  
  createSession: (email, password) => {
    console.log(email, password);
    return api.provider().account.createEmailSession(email, password);
  },

  deleteCurrentSession: () => {
    return api.provider().account.deleteSession("current");
  },

  createDocument: (collectionId, data, read=Permission.read(Role.any()), write=Permission.update(Role.any()), del=Permission.delete(Role.any()) ) => {
    return api
      .provider()
      .database.createDocument(Server.databaseID, collectionId, "unique()", data, [read, write, del]);
  },

  listDocuments: (collectionId) => {
    return api.provider().database.listDocuments(Server.databaseID, collectionId);
  },

  listDocumentsQuery: (collectionId, query) => {
    return api.provider().database.listDocuments(Server.databaseID, collectionId, query);
  },

  getDocument: (collectionId, docId) => {
    return api.provider().database.getDocument(Server.databaseID, collectionId, docId);
  },

  updateDocument: (collectionId, documentId, data, read=Permission.read(Role.any()), write=Permission.update(Role.any()), del=Permission.delete(Role.any()) ) => {
    return api
      .provider()
      .database.updateDocument(Server.databaseID, collectionId, documentId, Object.fromEntries(Object.entries(data).filter(([k]) => !k.startsWith('$'))), [read, write, del]);
  },

  deleteDocument: (collectionId, documentId) => {
    return api.provider().database.deleteDocument(Server.databaseID, collectionId, documentId);
  },

  createMedia: (bucketID, data, read=Permission.read(Role.any()), write=Permission.update(Role.any()), del=Permission.delete(Role.any()) ) => {
    return api
      .provider()
      .storage.createFile(bucketID, "unique()", data, [read, write, del]);
  },

  getMedia: async (bucketID, fileID) => {
    return api.provider().storage.getFileView(bucketID, fileID);
  },

  updateMedia: async (bucketID, fileID) => {
    return api.provider().storage.updateFile(bucketID, fileID);
  },

  deleteMedia: async (bucketID, fileID) => {
    return api.provider().storage.deleteFile(bucketID, fileID);
  },
};

export default api;
