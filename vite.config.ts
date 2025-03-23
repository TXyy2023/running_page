import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const individuallyPackages = ['activities', 'github.svg', 'grid.svg'];

export default defineConfig({
  server: {
    host: '0.0.0.0',  // 监听所有网络接口，允许外部访问
    port: 5173,       // 指定端口
    strictPort: true, // 如果端口被占用会直接报错，而不是切换到其他端口
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: ['**/*.svg'],
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          floatPrecision: 2,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeTitle: false,
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
  ],
  base: process.env.PATH_PREFIX || '/',
  define: {
    "import.meta.env.VERCEL": JSON.stringify(process.env.VERCEL),
  },
  build: {
    manifest: true,
    outDir: './dist',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendors';
          } else {
            for (const item of individuallyPackages) {
              if (id.includes(item)) {
                return item;
              }
            }
          }
        },
      },
    },
  },
});