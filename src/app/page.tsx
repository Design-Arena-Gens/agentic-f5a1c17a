'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  categoryOptions,
  curatedIdeas,
  pricePresets,
  CategoryOption,
} from "@/data/presets";
import { buildAmazonSearchUrl } from "@/lib/amazon";

type RecentSearch = {
  id: string;
  query: string;
  categoryValue: string;
  minPrice: number;
  timestamp: number;
};

const STORAGE_KEY = "amazonExpensiveSearches:v1";

const defaultQuery = "luxury watch limited edition";
const defaultCategory = "electronics";
const defaultMinPrice = 10000;

export default function Home() {
  const [query, setQuery] = useState(defaultQuery);
  const [categoryValue, setCategoryValue] = useState(defaultCategory);
  const [minPrice, setMinPrice] = useState(defaultMinPrice);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed: RecentSearch[] = JSON.parse(stored);
      return parsed
        .filter(
          (item) =>
            item?.query &&
            typeof item.query === "string" &&
            typeof item.minPrice === "number",
        )
        .slice(0, 8);
    } catch (error) {
      console.warn("Failed to load stored searches", error);
      return [];
    }
  });

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const currentCategory: CategoryOption =
    useMemo(
      () =>
        categoryOptions.find((option) => option.value === categoryValue) ??
        categoryOptions[0],
      [categoryValue],
    );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const openAmazonSearch = useCallback(
    (searchQuery: string, categorySlug: string, minPriceUsd: number) => {
      const category = categoryOptions.find(
        (option) => option.value === categorySlug,
      );
      const amazonUrl = buildAmazonSearchUrl({
        query: searchQuery,
        category: category?.departmentParam ?? "aps",
        minPrice: minPriceUsd,
      });

      window.open(amazonUrl, "_blank", "noopener,noreferrer");
    },
    [],
  );

  const persistRecentSearch = useCallback(
    (searchQuery: string, categorySlug: string, minPriceUsd: number) => {
      setRecentSearches((prev) => {
        const existing = prev.filter(
          (item) =>
            item.query !== searchQuery ||
            item.categoryValue !== categorySlug ||
            item.minPrice !== minPriceUsd,
        );

        const entry: RecentSearch = {
          id: `${searchQuery}-${categorySlug}-${minPriceUsd}`.toLowerCase(),
          query: searchQuery,
          categoryValue: categorySlug,
          minPrice: minPriceUsd,
          timestamp: Date.now(),
        };

        const updated = [entry, ...existing].sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        return updated.slice(0, 8);
      });
    },
    [],
  );

  const handleSearch = useCallback(
    (payload?: {
      query?: string;
      categoryValue?: string;
      minPrice?: number;
    }) => {
      const searchQuery = (payload?.query ?? query).trim();
      const searchCategory = payload?.categoryValue ?? categoryValue;
      const searchMinPrice = payload?.minPrice ?? minPrice;

      if (!searchQuery) return;

      persistRecentSearch(searchQuery, searchCategory, searchMinPrice);
      openAmazonSearch(searchQuery, searchCategory, searchMinPrice);
    },
    [
      categoryValue,
      minPrice,
      openAmazonSearch,
      persistRecentSearch,
      query,
    ],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch();
    },
    [handleSearch],
  );

  const handleSurprise = useCallback(() => {
    const selection =
      curatedIdeas[Math.floor(Math.random() * curatedIdeas.length)];
    setQuery(selection.query);
    setCategoryValue(selection.categoryValue ?? defaultCategory);
    setMinPrice(selection.minPrice ?? defaultMinPrice);
    handleSearch({
      query: selection.query,
      categoryValue: selection.categoryValue ?? defaultCategory,
      minPrice: selection.minPrice ?? defaultMinPrice,
    });
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-20 sm:px-10 lg:px-16">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_-40px_rgba(15,23,42,1)] backdrop-blur-xl sm:p-12">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-indigo-200">
              Amazon Luxe Radar
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Find the most extravagant listings Amazon has to offer.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200/80">
              Launch a high-to-low search, narrow it to luxury storefronts, and
              filter for five-figure price tags instantly. Save your favorite
              searches and dive back in whenever inspiration strikes.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 grid gap-6 rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-[0_16px_80px_-60px_rgba(0,0,0,0.8)] sm:grid-cols-[2fr_1fr] sm:gap-8 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:col-span-2">
              <label
                htmlFor="search-query"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200"
              >
                Search focus
              </label>
              <input
                id="search-query"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white shadow-inner outline-none transition focus:border-indigo-400 focus:bg-white/20 focus:shadow-[0_0_0_4px_rgba(129,140,248,0.25)]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. carbon fiber yacht tender"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="category-select"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200"
              >
                Department
              </label>
              <select
                id="category-select"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:bg-white/20 focus:shadow-[0_0_0_4px_rgba(129,140,248,0.25)]"
                value={categoryValue}
                onChange={(event) => setCategoryValue(event.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-300/70">
                {currentCategory.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="price-select"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200"
              >
                Minimum price
              </label>
              <select
                id="price-select"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:bg-white/20 focus:shadow-[0_0_0_4px_rgba(129,140,248,0.25)]"
                value={String(minPrice)}
                onChange={(event) => setMinPrice(Number(event.target.value))}
              >
                {pricePresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-300/70">
                We&apos;ll launch searches from {priceFormatter.format(minPrice)} and
                higher.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400/40"
                >
                  Launch Amazon search
                </button>
                <button
                  type="button"
                  onClick={handleSurprise}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200 transition hover:border-indigo-300/60 hover:text-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
                >
                  Surprise me
                </button>
              </div>
              <p className="text-xs text-slate-300/70">
                We open your search in a new tab on Amazon for the highest priced
                results first.
              </p>
            </div>
          </form>
        </section>

        {recentSearches.length > 0 && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Recent launches</h2>
            <p className="mt-1 text-sm text-slate-300/70">
              Jump back into a past search with one tap.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() =>
                    handleSearch({
                      query: search.query,
                      categoryValue: search.categoryValue,
                      minPrice: search.minPrice,
                    })
                  }
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-indigo-300/80 hover:bg-indigo-500/30 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
                >
                  <span>{search.query}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-indigo-200">
                    {priceFormatter.format(search.minPrice)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          {curatedIdeas.map((idea) => (
            <article
              key={idea.title}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-6 shadow-[0_24px_80px_-60px_rgba(15,23,42,1)] transition hover:border-indigo-400/60 hover:shadow-[0_24px_120px_-60px_rgba(99,102,241,0.45)]"
            >
              <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-white">
                  {idea.title}
                </h3>
                <p className="text-sm text-slate-300/80">{idea.subtitle}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {idea.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-indigo-200/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-300/70">
                  {idea.minPrice
                    ? `Starts at ${priceFormatter.format(idea.minPrice)}`
                    : "Uses your current minimum price"}
                </div>
                <button
                  onClick={() =>
                    handleSearch({
                      query: idea.query,
                      categoryValue: idea.categoryValue ?? categoryValue,
                      minPrice: idea.minPrice ?? minPrice,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-400/60 bg-indigo-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-400/30 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-400/25"
                >
                  Explore on Amazon
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
