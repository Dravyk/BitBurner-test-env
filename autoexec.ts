export async function main(ns: NS) {
  ns.run("overview.ts", { temporary: true });
  if (ns.scp("darknet-crawler.js", "darkweb", "home")) {
    ns.exec("darknet-crawler.js", "darkweb");
  }
}
