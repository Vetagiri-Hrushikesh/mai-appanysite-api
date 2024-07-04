import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';


console.log(serviceAccount)
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

export { admin };
