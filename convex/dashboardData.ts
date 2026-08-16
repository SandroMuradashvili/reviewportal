import { query } from "./_generated/server";
import { requireUser } from "./lib/auth";

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rawPortals = await ctx.db
        .query("portals")
        .withIndex("owner", (q) => q.eq("ownerId", user._id))
        .collect(),
      portals = await Promise.all(
        rawPortals.map(async (portal) => ({
          ...portal,
          logoUrl: portal.logoStorageId
            ? await ctx.storage.getUrl(portal.logoStorageId)
            : null,
        })),
      );
    const portalIds = new Set(portals.map((p) => p._id));
    const feedbackRows = (
      await Promise.all(
        portals.map((p) =>
          ctx.db
            .query("feedback")
            .withIndex("portal_date", (q) => q.eq("portalId", p._id))
            .order("desc")
            .take(500),
        ),
      )
    )
      .flat()
      .sort((a, b) => b.submittedAt - a.submittedAt);
    const visits = (
      await Promise.all(
        portals.map((p) =>
          ctx.db
            .query("visits")
            .withIndex("portal", (q) => q.eq("portalId", p._id))
            .collect(),
        ),
      )
    ).flat();
    const events = (
      await Promise.all(
        portals.map((p) =>
          ctx.db
            .query("events")
            .withIndex("portal_date", (q) => q.eq("portalId", p._id))
            .collect(),
        ),
      )
    ).flat();
    const total = feedbackRows.length,
      average = total
        ? feedbackRows.reduce((sum, row) => sum + row.rating, 0) / total
        : 0,
      happy = total
        ? (feedbackRows.filter((row) => row.rating >= 4).length / total) * 100
        : 0,
      redirects = events.filter(
        (event) => event.type === "redirect_clicked",
      ).length,
      dayMs = 86400000,
      today = new Date();
    today.setHours(0, 0, 0, 0);
    const daily = Array.from({ length: 30 }, (_, offset) => {
      const start = today.getTime() - (29 - offset) * dayMs,
        end = start + dayMs,
        rows = feedbackRows.filter(
          (row) => row.submittedAt >= start && row.submittedAt < end,
        );
      return {
        date: start,
        total: rows.length,
        ratings: [1, 2, 3, 4, 5].map(
          (rating) => rows.filter((row) => row.rating === rating).length,
        ),
      };
    });
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("owner", (q) => q.eq("ownerId", user._id))
      .unique();
    return {
      user,
      portals,
      subscription: subscription ?? {
        status: "trial" as const,
        trialLimit: 10,
      },
      metrics: {
        total,
        average,
        happy,
        uniqueVisitors: visits.length,
        conversion: visits.length ? (total / visits.length) * 100 : 0,
        redirects,
      },
      recent: feedbackRows.map((row) => ({
        ...row,
        portalName:
          portals.find((p) => p._id === row.portalId)?.name ?? "Portal",
      })),
      daily,
      ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: feedbackRows.filter((row) => row.rating === rating).length,
      })),
      portalMetrics: portals.map((portal) => {
        const rows = feedbackRows.filter((row) => row.portalId === portal._id),
          portalVisits = visits.filter((visit) => visit.portalId === portal._id),
          portalRedirects = events.filter(
            (event) => event.portalId === portal._id && event.type === "redirect_clicked",
          ).length,
          total = rows.length;
        return {
          portalId: portal._id,
          metrics: {
            total,
            average: total ? rows.reduce((sum, row) => sum + row.rating, 0) / total : 0,
            happy: total ? (rows.filter((row) => row.rating >= 4).length / total) * 100 : 0,
            uniqueVisitors: portalVisits.length,
            conversion: portalVisits.length ? (total / portalVisits.length) * 100 : 0,
            redirects: portalRedirects,
          },
          daily: daily.map((day) => {
            const dayRows = rows.filter(
              (row) => row.submittedAt >= day.date && row.submittedAt < day.date + dayMs,
            );
            return { date: day.date, total: dayRows.length, ratings: [1, 2, 3, 4, 5].map((rating) => dayRows.filter((row) => row.rating === rating).length) };
          }),
          ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({ rating, count: rows.filter((row) => row.rating === rating).length })),
        };
      }),
      portalCount: portalIds.size,
    };
  },
});
