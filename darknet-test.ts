export async function main(ns: NS) {
  ns.ui.clearTerminal();
  ns.scp("darknet-crawler.js", "darkweb", "home");
  ns.exec("darknet-crawler.js", "darkweb", { temporary: true });
}
