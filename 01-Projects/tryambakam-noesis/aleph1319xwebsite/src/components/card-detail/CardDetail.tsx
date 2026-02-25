import { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCardBySlug } from "../../content/card-catalog";
const UniqueLayoutDetail = lazy(() => import("./UniqueLayoutDetail"));

export default function CardDetail() {
  const { slug } = useParams<{ slug: string }>();
  const card = slug ? getCardBySlug(slug) : null;

  if (!card) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={null}>
      <UniqueLayoutDetail card={card} />
    </Suspense>
  );
}
