import { Appwrite } from "appwrite";
import { Server } from "../utils/config";

let api = {
  sdk: null,

  provider: () => {
    if (api.sdk) {
      return api.sdk;
    }
    let appwrite = new Appwrite();
   // console.log("work",Server.endpoint,Server.project);
   // console.log("work1",appwrite.setEndpoint(Server.endpoint).setProject(Server.project))
    appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
    api.sdk = appwrite;
    return appwrite;
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
    return api.provider().account.createSession(email, password);
  },

  deleteCurrentSession: () => {
    return api.provider().account.deleteSession("current");
  },

  createDocument: (collectionId, data, read, write) => {
    return api
      .provider()
      .database.createDocument(collectionId, "unique()", data, read, write);
  },

  listDocuments: (collectionId) => {
    return api.provider().database.listDocuments(collectionId);
  },

  listDocumentsQuery: (collectionId, query) => {
    return api.provider().database.listDocuments(collectionId, query);
  },

  getDocument: (collectionId, docId) => {
    return api.provider().database.getDocument(collectionId, docId);
  },

  updateDocument: (collectionId, documentId, data, read, write) => {
    return api
      .provider()
      .database.updateDocument(collectionId, documentId, data, read, write);
  },

  deleteDocument: (collectionId, documentId) => {
    return api.provider().database.deleteDocument(collectionId, documentId);
  },

  createMedia: (bucketID, data, read, write) => {
    return api
      .provider()
      .storage.createFile(bucketID, "unique()", data, read, write);
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
