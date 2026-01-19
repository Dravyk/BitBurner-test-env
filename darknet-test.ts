export async function main(ns: NS) {
  ns.ui.clearTerminal();
  console.clear();
  if (!ns.isRunning("overview.ts")) ns.run("overview.ts", { temporary: true });
  ns.scp("darknet-crawler.js", "darkweb", "home");
  ns.exec("darknet-crawler.js", "darkweb", { temporary: true });
}
