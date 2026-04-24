/**
 * QARCODE Routing Server
 * Uses Bun's HTTP server with route mapping
 */

const PORT = 3000;

// Route mapping: path -> file
const routes: Record<string, string> = {
  "/": "index.html",
  "/home": "home.html",
  "/scan": "scan.html",
  "/generate": "generate.html",
  "/history": "history.html",
  "/result": "result.html",
  "/onboarding": "onboarding.html",
};

export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if it's a route
    if (routes[pathname]) {
      const file = routes[pathname];
      return new Response(Bun.file(file));
    }

    // Serve static files (CSS, JS, images, etc.)
    try {
      const file = Bun.file(pathname.slice(1)); // Remove leading slash
      return new Response(file);
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },

  port: PORT,
};

console.log(`🚀 QARCODE Server running on http://localhost:${PORT}`);
