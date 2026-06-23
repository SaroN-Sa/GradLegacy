import { ID } from "appwrite";
import { account } from "@/lib/appwrite";

export const authService = {
async register(
name: string,
email: string,
password: string,
language?: string
) {
const user = await account.create(
ID.unique(),
email,
password,
name
);

```
return {
  user,
  language,
};
```

},

async login(
email: string,
password: string
) {
return await account.createEmailPasswordSession(
email,
password
);
},

async logout() {
return await account.deleteSession("current");
},

async getCurrentUser() {
try {
return await account.get();
} catch {
return null;
}
},
async forgotPassword(email: string) {
    return account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    );
  },

  async resetPassword(
    userId: string,
    secret: string,
    password: string
  ) {
    return account.updateRecovery(
      userId,
      secret,
      password
    );
  },
};
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

