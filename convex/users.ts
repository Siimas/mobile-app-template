import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const handleClerkWebhook = internalMutation({
  args: { event: v.any() },
  handler: async (ctx, { event }) => {
    const { type, data } = event;
    const clerkId: string = data.id;

    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined;
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { email, name });
      } else {
        await ctx.db.insert("users", { clerkId, email, name });
      }
    } else if (type === "user.deleted") {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
      if (existing) await ctx.db.delete(existing._id);
    }
  },
});
