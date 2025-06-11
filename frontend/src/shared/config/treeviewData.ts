export const treeviewData = [
  {
    key: "0",
    label: "📁 Projects",
    data: "Projects Folder",
    children: [
      {
        key: "0-0",
        label: "📁 VueApp",
        data: "Vue Application Project",
        children: [
          {
            key: "0-0-0",
            label: "📄 main.ts",
            data: "Main TS File",
          },
          {
            key: "0-0-1",
            label: "📄 App.vue",
            data: "Root Vue Component",
          },
        ],
      },
      {
        key: "0-1",
        label: "📁 Backend",
        data: "Backend Folder",
        children: [
          {
            key: "0-1-0",
            label: "📄 server.js",
            data: "Express Server Script",
          },
          {
            key: "0-1-1",
            label: "📄 routes.js",
            data: "API Routes",
          },
        ],
      },
    ],
  },
  {
    key: "1",
    label: "📁 Resources",
    data: "Resources Folder",
    children: [
      {
        key: "1-0",
        label: "📁 Images",
        data: "Image Assets",
        children: [
          {
            key: "1-0-0",
            label: "🖼️ logo.png",
            data: "Company Logo",
          },
          {
            key: "1-0-1",
            label: "🖼️ banner.jpg",
            data: "Banner Image",
          },
        ],
      },
      {
        key: "1-1",
        label: "📁 Docs",
        data: "Documentation Folder",
        children: [
          {
            key: "1-1-0",
            label: "📄 README.md",
            data: "Project Readme",
          },
          {
            key: "1-1-1",
            label: "📄 CHANGELOG.md",
            data: "Changelog File",
          },
        ],
      },
    ],
  },
  {
    key: "2",
    label: "📁 Archives",
    data: "Archived Files",
    children: [
      {
        key: "2-0",
        label: "📄 old_backup.zip",
        data: "Backup from 2022",
      },
      {
        key: "2-1",
        label: "📄 legacy_code.tar.gz",
        data: "Legacy system source",
      },
    ],
  },
];
