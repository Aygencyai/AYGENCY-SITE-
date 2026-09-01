import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/api/eden/leads", method: "POST" },
    { path: "/api/eden/applications", method: "POST" },
  ],
});
