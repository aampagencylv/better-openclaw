import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@better-openclaw/core"],

  // The core package barrel export re-exports generators that depend on
  // node:crypto and handlebars.  These generators are never called on the
  // client, but webpack still processes the imports.
  //
  // We strip the `node:` protocol prefix so webpack can apply its normal
  // fallback logic, then set `crypto: false` to resolve it to an empty module.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        crypto: false,
      };

      // Custom plugin: rewrite `node:<module>` → `<module>` so fallback works
      config.plugins.push({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apply(compiler: any) {
          compiler.hooks.normalModuleFactory.tap(
            "NodeProtocolPlugin",
            (factory: any) => {
              factory.hooks.beforeResolve.tap(
                "NodeProtocolPlugin",
                (resolveData: any) => {
                  if (resolveData?.request?.startsWith("node:")) {
                    resolveData.request = resolveData.request.slice(5);
                  }
                },
              );
            },
          );
        },
      });
    }
    return config;
  },
};

export default nextConfig;
