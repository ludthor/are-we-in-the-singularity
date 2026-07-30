import SingularityPage from "./singularity-page";
import { createLocalizedMetadata } from "./site-metadata";

export const generateMetadata = () => createLocalizedMetadata("en");

export default function Home() {
  return <SingularityPage locale="en" />;
}
