import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  // Load env file from the current directory
  // Setting the 3rd argument to '' allows you to read ANY variable (not just VITE_ ones)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
      basicSsl(),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.BACKEND_API_TARGET,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: env.FRONTEND_DOMAIN,
        }
      }
    },
    build: {
      emptyOutDir: true,
    },
  };
});