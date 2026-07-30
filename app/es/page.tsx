import SingularityPage from "../singularity-page";
import { createLocalizedMetadata } from "../site-metadata";

export const generateMetadata = () => createLocalizedMetadata("es");

export default function SpanishHome() {
  return <SingularityPage locale="es" />;
}
