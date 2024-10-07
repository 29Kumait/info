import { MetaFunction, redirect } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Flash Back" },
    { name: "description", content: "portfolio page" },
  ];
};


export const loader: LoaderFunction = async () => {
  return redirect(`/cards/ticker`);
};

import ErrorBoundary from "./errorBoundary";
export { ErrorBoundary };