import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "src/services/auth/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
