import { db } from "./firebaseConfig.js"; // Import your initialized db
import { doc, setDoc } from "firebase/firestore";

async function testConnection() {
  try {
    await setDoc(doc(db, "connection_test", "status"), {
      connected: true,
      timestamp: new Date()
    });
    console.log("Success! Firebase is connected and data was written.");
  } catch (e) {
    console.error("Connection failed: ", e);
  }
}

testConnection();