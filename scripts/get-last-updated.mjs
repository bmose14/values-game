const now = new Date();
const formatted = now.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

process.stdout.write(formatted);
