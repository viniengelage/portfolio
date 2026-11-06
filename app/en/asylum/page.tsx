import type { Metadata } from "next";
import { AsylumLanding } from "../../../components/asylum/landing";
import { asylumMetadata } from "../../../content/asylum";

export const metadata: Metadata = asylumMetadata("en");

export default function AsylumEnglishPage() {
  return <AsylumLanding locale="en" />;
}
