export function parseFirebaseError(errorMessage) {
  const errorMap = {
    "auth/invalid-credential": "Invalid credentials",
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
    "auth/email-already-in-use": "Email in use",
    "auth/weak-password": "Weak password",
    "auth/invalid-email": "Invalid email",
    "auth/operation-not-allowed": "Not allowed",
    "auth/account-exists-with-different-credential": "Diff. credential",
    "auth/too-many-requests": "Too many requests",
    "auth/network-request-failed": "Network failed",
    "auth/requires-recent-login": "Login required",
    "auth/user-disabled": "User disabled",
    "auth/user-token-expired": "Token expired",
    "auth/web-storage-unsupported": "No web storage",
    // Add more mappings as needed
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }
  return "Log in failed, please retry";
}
