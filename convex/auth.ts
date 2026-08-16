import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) return args.existingUserId;
      const email =
        typeof args.profile.email === "string"
          ? args.profile.email.trim().toLowerCase()
          : undefined;
      if (email) {
        const matches = (await ctx.db.query("users").collect()).filter(
          (user) => user.email?.toLowerCase() === email,
        );
        if (matches.length) {
          if (args.type === "credentials")
            throw new Error(
              "An account with this email already exists. Sign in with the original method first.",
            );
          return matches[0]._id;
        }
      }
      return ctx.db.insert("users", {
        email,
        name:
          typeof args.profile.name === "string" ? args.profile.name : undefined,
        image:
          typeof args.profile.image === "string"
            ? args.profile.image
            : undefined,
        emailVerificationTime: args.type === "oauth" ? Date.now() : undefined,
        role: "owner",
        state: "active",
      });
    },
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!user) return;
      const isAdmin = Boolean(
        user.email && adminEmails.has(user.email.toLowerCase()),
      );
      await ctx.db.patch(userId, {
        role: isAdmin ? "admin" : "owner",
        state: user.state ?? "active",
      });
    },
  },
});
