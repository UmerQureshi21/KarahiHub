import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchRecipes } from "../services/recipeService";
import type {
  PageResponse,
  RecipeResponse,
  SearchFilterRequest,
  SortBy,
} from "../types";
import { CATEGORIES, SORT_OPTIONS, formatCategory } from "../utils/recipes";
import RecipeGrid from "../components/RecipeGrid";
import SortControls from "../components/SortControls";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";

const PAGE_SIZE = 9;
// How long to wait after the last keystroke before searching
const TYPING_DELAY_MS = 400;

// Range filters are kept as strings so an empty box means "no limit"
const RANGE_KEYS = [
  "minPrep",
  "maxPrep",
  "minCook",
  "maxCook",
  "minRating",
  "maxRating",
  "minServings",
  "maxServings",
] as const;
type RangeKey = (typeof RANGE_KEYS)[number];

// Everything the form controls (what the user is editing)
type Filters = {
  query: string;
  categories: string[];
  sortBy: SortBy;
  ascending: boolean;
} & Record<RangeKey, string>;

// What was actually searched — the filters plus which page of results
type AppliedSearch = Filters & { page: number };

const DEFAULT_FILTERS: Filters = {
  query: "",
  categories: [],
  sortBy: "RATING",
  ascending: false,
  minPrep: "",
  maxPrep: "",
  minCook: "",
  maxCook: "",
  minRating: "",
  maxRating: "",
  minServings: "",
  maxServings: "",
};

// --- URL <-> search state ---
// The applied search is mirrored into the URL (?q=karahi&page=2...), so coming
// back from a recipe, reloading, or sharing the link restores the same results.

function readSearch(params: URLSearchParams): AppliedSearch {
  const sort = params.get("sort");
  const ranges = Object.fromEntries(
    RANGE_KEYS.map((key) => [key, params.get(key) ?? ""]),
  ) as Record<RangeKey, string>;
  return {
    ...ranges,
    query: params.get("q") ?? "",
    categories: (params.get("cat") ?? "")
      .split(",")
      .filter((c) => CATEGORIES.includes(c)),
    sortBy: SORT_OPTIONS.some((o) => o.value === sort)
      ? (sort as SortBy)
      : DEFAULT_FILTERS.sortBy,
    ascending: params.get("asc") === "1",
    // 1-based in the URL because that's what the user sees
    page: Math.max(0, (parseInt(params.get("page") ?? "1") || 1) - 1),
  };
}

// Only non-default values go in the URL, to keep it short
function writeSearch(search: AppliedSearch): URLSearchParams {
  const params = new URLSearchParams();
  if (search.query) params.set("q", search.query);
  if (search.categories.length) params.set("cat", search.categories.join(","));
  RANGE_KEYS.forEach((key) => {
    if (search[key]) params.set(key, search[key]);
  });
  if (search.sortBy !== DEFAULT_FILTERS.sortBy) params.set("sort", search.sortBy);
  if (search.ascending) params.set("asc", "1");
  if (search.page > 0) params.set("page", String(search.page + 1));
  return params;
}

// Same filters? (page ignored) — used to skip searches that wouldn't change anything
const sameFilters = (a: Filters, b: Filters) =>
  writeSearch({ ...a, page: 0 }).toString() ===
  writeSearch({ ...b, page: 0 }).toString();

// Turns the form's strings into the backend request, filling in "no limit" bounds
function toRequest(search: AppliedSearch): SearchFilterRequest {
  const int = (value: string, fallback: number) =>
    value === "" ? fallback : parseInt(value) || fallback;
  const float = (value: string, fallback: number) =>
    value === "" ? fallback : parseFloat(value) || fallback;

  return {
    query: search.query.trim(),
    // if no categories selected, send all so nothing gets filtered out
    categories: search.categories.length > 0 ? search.categories : CATEGORIES,
    minPrep: int(search.minPrep, 0),
    maxPrep: int(search.maxPrep, 1440),
    minCook: int(search.minCook, 0),
    maxCook: int(search.maxCook, 1440),
    minRating: float(search.minRating, 0),
    maxRating: float(search.maxRating, 5),
    minServings: int(search.minServings, 1),
    // generous upper bound so recipes with lots of servings aren't hidden by default
    maxServings: int(search.maxServings, 1000),
    sortBy: search.sortBy,
    ascending: search.ascending,
    page: search.page,
    size: PAGE_SIZE,
  };
}

// Number of filters that differ from the defaults (shown on the toggle button)
const countActiveFilters = (filters: Filters) =>
  (filters.categories.length > 0 ? 1 : 0) +
  RANGE_KEYS.filter((key) => filters[key] !== "").length;

// The result of one search, tagged with the search it answers
type SearchResult = {
  search: AppliedSearch;
  page?: PageResponse<RecipeResponse>;
  error?: string;
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Both start from the URL, so returning to this page restores the last search
  const [draft, setDraft] = useState<Filters>(() => readSearch(searchParams));
  const [applied, setApplied] = useState<AppliedSearch>(() =>
    readSearch(searchParams),
  );
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showFilters, setShowFilters] = useState(
    () => countActiveFilters(applied) > 0,
  );

  // ref copy of `applied` so the delayed typing callback sees the latest value
  const appliedRef = useRef(applied);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  // Run a search: store it, mirror it to the URL (replace, so filter tweaks don't
  // fill the back-button history), and the effect below fetches it.
  function apply(next: AppliedSearch) {
    appliedRef.current = next;
    setApplied(next);
    setSearchParams(writeSearch(next), { replace: true });
  }

  // Update the form. Clicks (chips, sort) search straight away; typing waits
  // until the user pauses. Any filter change goes back to page 1.
  function updateDraft(patch: Partial<Filters>, immediate = false) {
    const next = { ...draft, ...patch };
    setDraft(next);
    clearTimeout(typingTimer.current);

    const run = () => {
      if (!sameFilters(next, appliedRef.current)) apply({ ...next, page: 0 });
    };
    if (immediate) run();
    else typingTimer.current = setTimeout(run, TYPING_DELAY_MS);
  }

  function goToPage(page: number) {
    apply({ ...appliedRef.current, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Resets categories and ranges; keeps the search text and sort order
  function clearFilters() {
    updateDraft(
      {
        ...DEFAULT_FILTERS,
        query: draft.query,
        sortBy: draft.sortBy,
        ascending: draft.ascending,
      },
      true,
    );
  }

  function toggleCategory(category: string) {
    updateDraft(
      {
        categories: draft.categories.includes(category)
          ? draft.categories.filter((c) => c !== category)
          : [...draft.categories, category],
      },
      true,
    );
  }

  // Fetch whenever the applied search changes (including on first load)
  useEffect(() => {
    let cancelled = false; // drop responses for searches that have been superseded
    searchRecipes(toRequest(applied))
      .then((page) => {
        if (!cancelled) setResult({ search: applied, page });
      })
      .catch((err) => {
        console.error("Error searching recipes:", err);
        if (!cancelled)
          setResult({ search: applied, error: "Search failed. Please try again." });
      });
    return () => {
      cancelled = true;
    };
  }, [applied]);

  // Still waiting if the latest result is for an older search
  const loading = result?.search !== applied;
  const page = result?.page;
  const recipes = page?.content ?? [];
  const activeFilterCount = countActiveFilters(draft);

  // "Showing 10–18 of 42 recipes"
  const firstShown = page ? page.number * page.size + 1 : 0;
  const lastShown = page ? page.number * page.size + page.content.length : 0;

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10 mx-auto min-h-screen">
      <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)] mb-2">
        Search Recipes
      </h1>
      <p className="fred-light text-[15px] text-[var(--muted)] mb-6">
        Find recipes by title, then narrow them down by category, time,
        rating, or servings.
      </p>

      {/* Search bar — results update as you type; Enter / the button searches right away */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          updateDraft({}, true);
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="search"
          value={draft.query}
          onChange={(e) => updateDraft({ query: e.target.value })}
          placeholder="e.g. Chicken Karahi"
          aria-label="Search by title"
          className="flex-1 min-w-0 px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] fred-med text-[14px] text-[var(--primary)] outline-none focus:border-[var(--secondary)] transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-[10px] bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[14px] hover:opacity-90 transition-opacity shrink-0"
        >
          Search
        </button>
      </form>

      {/* Toggle filters button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          className="fred-med text-[14px] text-[var(--secondary)] hover:underline"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="fred-med text-[14px] text-[var(--muted)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter & Sort panel */}
      {showFilters && (
        <div className="bg-[var(--accent)] rounded-[16px] p-5 mb-8 flex flex-col gap-5">
          {/* Category filter */}
          <div>
            <h3 className="fred-bold text-[14px] text-[var(--primary)] mb-2">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const selected = draft.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[13px] fred-med transition-colors ${
                      selected
                        ? "bg-[var(--secondary)] text-[var(--on-secondary)]"
                        : "bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] hover:border-[var(--secondary)]"
                    }`}
                  >
                    {formatCategory(cat)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Range filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RangeField
              label="Prep Time (min)"
              minKey="minPrep"
              maxKey="maxPrep"
              draft={draft}
              onChange={updateDraft}
              min={0}
            />
            <RangeField
              label="Cook Time (min)"
              minKey="minCook"
              maxKey="maxCook"
              draft={draft}
              onChange={updateDraft}
              min={0}
            />
            <RangeField
              label="Rating"
              minKey="minRating"
              maxKey="maxRating"
              draft={draft}
              onChange={updateDraft}
              min={0}
              max={5}
              step={0.1}
            />
            <RangeField
              label="Servings"
              minKey="minServings"
              maxKey="maxServings"
              draft={draft}
              onChange={updateDraft}
              min={1}
            />
          </div>

          {/* Sort controls */}
          <SortControls
            sortBy={draft.sortBy}
            onSortChange={(sortBy) => updateDraft({ sortBy }, true)}
            ascending={draft.ascending}
            onAscendingChange={(ascending) => updateDraft({ ascending }, true)}
          />
        </div>
      )}

      {/* Results summary — how many matched and which page you're on */}
      {page && page.totalElements > 0 && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 mb-4"
          aria-live="polite"
        >
          <p className="fred-med text-[14px] text-[var(--muted)]">
            Showing {firstShown}–{lastShown} of {page.totalElements} recipe
            {page.totalElements !== 1 && "s"}
          </p>
          {/* Shown even for a single page, so you always know where you are */}
          {page.number < page.totalPages && (
            <span className="fred-bold text-[13px] text-[var(--secondary)] bg-[var(--secondary)]/10 px-3 py-1 rounded-full">
              Page {page.number + 1} of {page.totalPages}
            </span>
          )}
        </div>
      )}

      {/* First load — nothing to show yet */}
      {loading && !result && <Spinner label="Searching..." />}

      {result?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-[12px] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="fred-med text-[14px] text-red-500">{result.error}</p>
          <button
            type="button"
            onClick={() => apply({ ...appliedRef.current })}
            className="fred-med text-[14px] text-red-500 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* No matches at all */}
      {page && page.totalElements === 0 && (
        <div className="py-12 text-center">
          <p className="fred-med text-[15px] text-[var(--muted)]">
            {result?.search.query
              ? `No recipes found for "${result.search.query}".`
              : "No recipes match these filters."}
          </p>
          {result && countActiveFilters(result.search) > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 fred-med text-[14px] text-[var(--secondary)] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Page number past the end (e.g. an old link) */}
      {page && page.totalElements > 0 && recipes.length === 0 && (
        <div className="py-12 text-center">
          <p className="fred-med text-[15px] text-[var(--muted)]">
            There's nothing on this page.
          </p>
          <button
            type="button"
            onClick={() => goToPage(0)}
            className="mt-3 fred-med text-[14px] text-[var(--secondary)] hover:underline"
          >
            Go to page 1
          </button>
        </div>
      )}

      {recipes.length > 0 && page && (
        <>
          {/* Keep the old results visible (dimmed) while the next search loads */}
          <div
            className={`transition-opacity duration-200 ${loading ? "opacity-50" : ""}`}
            aria-busy={loading}
          >
            <RecipeGrid recipes={recipes} />
          </div>

          <Pagination
            page={page.number}
            totalPages={page.totalPages}
            onPageChange={goToPage}
            disabled={loading}
          />
        </>
      )}
    </div>
  );
}

type RangeFieldProps = {
  label: string;
  minKey: RangeKey;
  maxKey: RangeKey;
  draft: Filters;
  onChange: (patch: Partial<Filters>) => void;
  min: number;
  max?: number;
  step?: number;
};

// A labelled "min to max" pair of number boxes. Empty means no limit.
function RangeField({
  label,
  minKey,
  maxKey,
  draft,
  onChange,
  min,
  max,
  step,
}: RangeFieldProps) {
  const inputClass =
    "w-full min-w-0 px-3 py-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]";

  return (
    <fieldset>
      <legend className="fred-bold text-[13px] text-[var(--primary)] mb-1">
        {label}
      </legend>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={draft[minKey]}
          onChange={(e) => onChange({ [minKey]: e.target.value })}
          placeholder="Min"
          aria-label={`${label} minimum`}
          className={inputClass}
        />
        <span className="fred-light text-[13px] text-[var(--muted)]">to</span>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={draft[maxKey]}
          onChange={(e) => onChange({ [maxKey]: e.target.value })}
          placeholder="Any"
          aria-label={`${label} maximum`}
          className={inputClass}
        />
      </div>
    </fieldset>
  );
}
