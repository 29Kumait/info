import {createCookie} from "@remix-run/node";

export const slideCookie = createCookie("slideIndex", {
    maxAge: 604_800, // a week
});