import { rest } from "msw";

export const handlers = [
  rest.get("https://api.tvmaze.com/schedule/", (req, res, ctx) => {
    // respond using a mocked JSON body
    // return res(ctx.json(mockScheduleResponse));
  }),
  rest.get("https://api.tvmaze.com/shows/:id/cast", (req, res, ctx) => {
    // respond using a mocked JSON body
    // return res(ctx.json(mockCastResponse));
  }),
  rest.get("https://api.tvmaze.com/shows/:id", (req, res, ctx) => {
    // respond using a mocked JSON body
    // return res(ctx.json(mockShowResponse));
  }),
];
