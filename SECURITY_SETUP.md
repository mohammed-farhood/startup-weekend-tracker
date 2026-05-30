# Security Setup — Required Manual Steps

The code is ready, but two things must be done in the Firebase Console before the app will work for anyone. Do these steps ONLY AFTER all three accounts exist and the code is merged, or everyone gets locked out.

---

## 1. Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/) → project **startup-weekend-4e0a7**
2. Left sidebar → **Authentication** → **Sign-in method** tab
3. Click **Email/Password** → toggle **Enable** → **Save**

---

## 2. Create the Three User Accounts

Still in **Authentication** → **Users** tab, click **Add user** three times:

| Display name | Email                          | Password         |
|--------------|-------------------------------|------------------|
| Mohammed     | mohammed@startupweekend.app   | (choose one)     |
| Eyad         | eyad@startupweekend.app       | (choose one)     |
| Yusuf        | yusuf@startupweekend.app      | (choose one)     |

Share each person's password with them privately — do NOT commit passwords to git.

---

## 3. Deploy the Database Security Rules

### Option A — Firebase Console (no CLI needed)

1. Left sidebar → **Realtime Database** → **Rules** tab
2. Replace the existing rules with the contents of `database.rules.json`:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "data": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. Click **Publish**

### Option B — Firebase CLI

```bash
firebase deploy --only database
```

(Requires `firebase-tools` installed and `firebase login` completed.)

---

## Order of operations (critical)

1. Enable Email/Password provider
2. Create all three user accounts
3. Merge the code to production
4. Deploy the database rules

Deploying rules before step 3 will lock everyone out of the app immediately.
