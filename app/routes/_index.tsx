import { MetaFunction, redirect } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "info" },
    { name: "description", content: "portfolio page" },
  ];
};


export const loader: LoaderFunction = async () => {
  return redirect(`photos/cards/apps/cards/ticker/music`);
};

import ErrorBoundary from "./errorBoundary";
export { ErrorBoundary };
