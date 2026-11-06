import type { Metadata } from "next";
import { AsylumLanding } from "../../components/asylum/landing";
import { asylumMetadata } from "../../content/asylum";

export const metadata: Metadata = asylumMetadata("pt");

export default function AsylumPage() {
  return <AsylumLanding locale="pt" />;
}
