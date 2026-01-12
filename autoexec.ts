export async function main(ns: NS) {
  ns.run("overview.ts", { temporary: true });
  ns.run("darknet-test.ts");
}
