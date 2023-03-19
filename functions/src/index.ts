import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Set default custom claims for a new user who signs in with Google
export const setDefaultCustomClaims = functions.auth.user().onCreate(async (user) => {
    if (user.providerData[0]?.providerId === "google.com") {
    await admin.auth().setCustomUserClaims(user.uid, { role: "patient" });
}
});