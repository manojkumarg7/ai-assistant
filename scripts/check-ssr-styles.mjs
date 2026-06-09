const routes = ["/", "/assistant"];
for (const route of routes) {
  const ssr = await (await fetch(`http://localhost:3000${route}`)).text();
  const styles = [...ssr.matchAll(/style="([^"]+)"/g)].map((m) => m[1]);
  console.log(route, "inline styles count:", styles.length, styles.slice(0, 8));
}
