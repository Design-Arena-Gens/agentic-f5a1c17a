export type AmazonSearchOptions = {
  query: string;
  category?: string;
  minPrice?: number;
};

/**
 * Builds a high-to-low Amazon search URL.
 * Amazon price filters expect cents, so we multiply USD by 100.
 */
export function buildAmazonSearchUrl({
  query,
  category = "aps",
  minPrice,
}: AmazonSearchOptions) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    throw new Error("Query is required to build an Amazon search URL.");
  }

  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", trimmedQuery);
  url.searchParams.set("s", "price-desc-rank");

  if (category && category !== "aps") {
    url.searchParams.set("i", category);
  }

  if (typeof minPrice === "number" && Number.isFinite(minPrice) && minPrice > 0) {
    const priceInCents = Math.max(1, Math.round(minPrice * 100));
    url.searchParams.set("rh", `p_36:${priceInCents}-`);
  }

  return url.toString();
}
