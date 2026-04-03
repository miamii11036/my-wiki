export const SITE = {
  website: "https://miamii11036.github.io/my-wiki/",
  author: "KY",
  profile: "https://miamii11036.github.io/my-wiki/",
  desc: "Miliya的知識海",
  title: "Miliya's Expedition",
  ogImage: "banner.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/miamii11036/my-wiki/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-TW", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Taipei", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
