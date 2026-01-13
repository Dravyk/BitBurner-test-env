export async function main(ns: NS) {
  ns.ui.clearTerminal();
  console.clear();
  ns.scp("darknet-crawler.js", "darkweb", "home");
  ns.exec("darknet-crawler.js", "darkweb", { temporary: true });
}
