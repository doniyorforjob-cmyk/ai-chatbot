import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const getByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("secrets")
            .withIndex("by_name", (q) => q.eq("name", args.name))
            .unique();
    },
});

export const upsert = mutation({
    args: {
        name: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("secrets")
            .withIndex("by_name", (q) => q.eq("name", args.name))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("secrets", { name: args.name, value: args.value });
        }
    },
});
