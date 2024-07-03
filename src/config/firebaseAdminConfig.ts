import * as admin from 'firebase-admin';
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export { admin };
