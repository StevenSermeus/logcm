import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>📑 Logcm </span>,
  project: {
    link: "https://github.com/StevenSermeus/logcm",
  },
  docsRepositoryBase: "https://github.com/StevenSermeus/logcm/docs",
  footer: {
    text: "Documentation powered by Nextra",
  },
  toc: {
    float: true,
  },
};

export default config;
