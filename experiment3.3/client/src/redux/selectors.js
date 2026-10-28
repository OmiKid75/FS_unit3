import { createSelector } from "reselect";

// ---------------------------------------------------------------------------
// Base selectors — trivial reads with no computation. Reselect only
// recomputes a memoized selector when the *reference* returned by its inputs
// changes, so keeping these as plain property reads is what makes the
// memoization actually pay off.
// ---------------------------------------------------------------------------
const selectPostsItems = (state) => state.posts.items;
const selectDraftsItems = (state) => state.drafts.items;
const selectCalendarState = (state) => state.calendar;
const selectFilters = (_, filters) => filters;

export const selectSelectedPlatforms = (state) => state.platforms.selected;

// ---------------------------------------------------------------------------
// All Posts — merges postsSlice + draftsSlice into one de-duplicated pool
// (by _id) so every selector below has a single, consistent source of truth
// regardless of which slice a given post is currently tracked in.
// ---------------------------------------------------------------------------
export const selectAllPosts = createSelector(
  [selectPostsItems, selectDraftsItems],
  (posts, drafts) => {
    const byId = new Map();
    [...posts, ...drafts].forEach((p) => byId.set(p._id, p));
    return [...byId.values()];
  }
);

// ---------------------------------------------------------------------------
// Status-based derived collections (Part D requirement)
// ---------------------------------------------------------------------------
export const selectPublishedPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.status === "published")
);

export const selectDraftPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.status === "draft")
);

export const selectScheduledPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.status === "scheduled")
);

// ---------------------------------------------------------------------------
// Platform-based derived collections (Part D requirement)
// ---------------------------------------------------------------------------
export const selectFacebookPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platforms.includes("facebook"))
);

export const selectInstagramPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platforms.includes("instagram"))
);

export const selectWhatsappPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platforms.includes("whatsapp"))
);

// ---------------------------------------------------------------------------
// Generic filtered posts — powers the search & filter bar on Drafts/Scheduled
// ---------------------------------------------------------------------------
export const selectFilteredPosts = createSelector(
  [selectAllPosts, selectFilters],
  (posts, filters = {}) => {
    const { platform, status, keyword, dateFrom, dateTo } = filters;
    return posts.filter((post) => {
      if (platform && !post.platforms.includes(platform)) return false;
      if (status && post.status !== status) return false;
      if (keyword && !post.content.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (dateFrom && post.scheduledDate && new Date(post.scheduledDate) < new Date(dateFrom)) return false;
      if (dateTo && post.scheduledDate && new Date(post.scheduledDate) > new Date(dateTo)) return false;
      return true;
    });
  }
);

// ---------------------------------------------------------------------------
// Dashboard summary cards
// ---------------------------------------------------------------------------
export const selectDashboardStats = createSelector([selectAllPosts], (posts) => {
  const platformCounts = { facebook: 0, instagram: 0, whatsapp: 0 };
  posts.forEach((p) =>
    p.platforms.forEach((plat) => {
      if (platformCounts[plat] !== undefined) platformCounts[plat] += 1;
    })
  );

  return {
    total: posts.length,
    drafts: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    published: posts.filter((p) => p.status === "published").length,
    platformCounts,
  };
});

export const selectRecentPosts = createSelector([selectAllPosts], (posts) =>
  [...posts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)
);

// ---------------------------------------------------------------------------
// Analytics Summary (Part D requirement) — computed entirely client-side
// from posts already living in the store. This is what replaced the old
// dependency on a separate GET /api/analytics network call, which is what
// was causing the Analytics dashboard to render empty/broken.
// ---------------------------------------------------------------------------
export const selectAnalyticsSummary = createSelector([selectAllPosts], (posts) => {
  const postsPerPlatform = { facebook: 0, instagram: 0, whatsapp: 0 };
  posts.forEach((p) =>
    p.platforms.forEach((plat) => {
      if (postsPerPlatform[plat] !== undefined) postsPerPlatform[plat] += 1;
    })
  );

  const ranked = Object.entries(postsPerPlatform).sort((a, b) => b[1] - a[1]);
  const mostActivePlatform = ranked[0] && ranked[0][1] > 0 ? ranked[0][0] : null;

  return {
    totalPosts: posts.length,
    draftCount: posts.filter((p) => p.status === "draft").length,
    scheduledCount: posts.filter((p) => p.status === "scheduled").length,
    publishedCount: posts.filter((p) => p.status === "published").length,
    postsPerPlatform,
    mostActivePlatform,
  };
});

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------------------------------------------------------------------------
// Monthly Statistics (Part D requirement) — groups posts by creation month
// ---------------------------------------------------------------------------
export const selectMonthlyStatistics = createSelector([selectAllPosts], (posts) => {
  const counts = {};
  posts.forEach((p) => {
    if (!p.createdAt) return;
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([key, count]) => {
      const [year, month] = key.split("-").map(Number);
      return { year, month, label: `${MONTH_LABELS[month]} ${year}`, count };
    })
    .sort((a, b) => a.year - b.year || a.month - b.month);
});

// Chart-ready shapes derived from the two selectors above (kept separate
// so a chart re-render is triggered only by the exact data it consumes)
export const selectPlatformChartData = createSelector([selectAnalyticsSummary], (summary) =>
  Object.entries(summary.postsPerPlatform).map(([name, value]) => ({ name, value }))
);

export const selectStatusChartData = createSelector([selectAnalyticsSummary], (summary) => [
  { name: "Draft", value: summary.draftCount },
  { name: "Scheduled", value: summary.scheduledCount },
  { name: "Published", value: summary.publishedCount },
]);

export const selectMonthlyTrendData = createSelector([selectMonthlyStatistics], (stats) =>
  stats.map((s) => ({ label: s.label, count: s.count }))
);

// ---------------------------------------------------------------------------
// Calendar Events (Part D requirement) — grouped by day for the visible month
// ---------------------------------------------------------------------------
export const selectCalendarEvents = createSelector(
  [selectAllPosts, selectCalendarState],
  (posts, calendar) => {
    const { viewYear, viewMonth } = calendar;
    const eventsByDay = {};

    posts.forEach((post) => {
      const dateSource = post.scheduledDate || post.createdAt;
      if (!dateSource) return;
      const date = new Date(dateSource);
      if (date.getFullYear() !== viewYear || date.getMonth() !== viewMonth) return;

      const day = date.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(post);
    });

    return eventsByDay;
  }
);
