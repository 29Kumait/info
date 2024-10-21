import { LoaderFunction } from "@remix-run/node";
import { getPdf } from "~/db/downloadCV.server";

export const loader: LoaderFunction = async () => {
    return getPdf();
};
