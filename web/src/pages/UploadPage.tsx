import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { postRecipe } from "../services/recipeService";
import type { IngredientRequest, RecipeRequest, RecipeResponse } from "../types";
import { CATEGORIES, formatCategory } from "../utils/recipes";
import UnitPicker from "../components/UnitPicker";

const emptyIngredient: IngredientRequest = {
  name: "",
  quantity: "",
  unitOfMeasurement: null,
};

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRequest[]>([
    { ...emptyIngredient },
  ]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [prepTime, setPrepTime] = useState<number | "">("");
  const [cookTime, setCookTime] = useState<number | "">("");
  const [servingCount, setServingCount] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // the recipe that was just uploaded, so the success banner can link to it
  const [uploaded, setUploaded] = useState<RecipeResponse | null>(null);

  // Create preview URLs for selected images and revoke them on cleanup
  const previewUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  // --- Ingredient helpers ---
  const updateIngredient = (
    index: number,
    field: keyof IngredientRequest,
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index] = {
      ...updated[index],
      [field]: value === "" && field === "unitOfMeasurement" ? null : value,
    };
    setIngredients(updated);
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { ...emptyIngredient }]);

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return; // keep at least one
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // --- Instruction helpers ---
  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstruction = () => setInstructions([...instructions, ""]);

  const removeInstruction = (index: number) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // --- Image helpers ---
  const addImages = (files: FileList | null) => {
    if (!files) return;
    // Only allow up to 3 total
    const remaining = 3 - images.length;
    const newFiles = Array.from(files).slice(0, remaining);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // --- Category toggle ---
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploaded(null);

    // The banners sit at the top of the form, so bring them into view
    const showBanner = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // The backend requires a category, and search only finds recipes through them
    if (selectedCategories.length === 0) {
      setError("Pick at least one category so people can find your recipe.");
      showBanner();
      return;
    }

    const recipe: RecipeRequest = {
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients.map((ing) => ({
        name: ing.name.trim(),
        quantity: ing.quantity.trim(),
        unitOfMeasurement: ing.unitOfMeasurement?.trim() || null,
      })),
      instructions: instructions.map((s) => s.trim()).filter((s) => s !== ""),
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      servingCount: Number(servingCount) || 1,
      categories: selectedCategories,
    };

    setSubmitting(true);
    try {
      setUploaded(await postRecipe(recipe, images));
      // Reset form
      setTitle("");
      setDescription("");
      setIngredients([{ ...emptyIngredient }]);
      setInstructions([""]);
      setPrepTime("");
      setCookTime("");
      setServingCount("");
      setImages([]);
      setSelectedCategories([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
      showBanner();
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-[10px] border border-[var(--border)] md:border-[var(--accent)] bg-[var(--surface)] fred-med text-[14px] text-[var(--primary)] outline-none focus:border-[var(--secondary)] transition-colors";

  const labelClass = "fred-med text-[14px] text-[var(--primary)] mb-1.5 block";

  return (
    <div className="bg-[var(--surface)] md:py-[50px]">
      <div className="p-[40px] md:rounded-[20px]  w-full max-w-[720px] md:bg-[var(--accent)] mx-auto">
        <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)] mb-2">
          Upload Recipe
        </h1>
        <p className="fred-light text-[15px] text-[var(--muted)] mb-8">
          Share your favourite recipe with the community.
        </p>
        {/* Success banner */}
        {uploaded && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-2 bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 text-[var(--secondary)] fred-med text-[14px] px-4 py-3 rounded-[10px] mb-6"
          >
            <span>Recipe uploaded successfully!</span>
            <Link
              to={`/app/recipes/${uploaded.id}`}
              state={{ recipe: uploaded }}
              className="fred-bold underline"
            >
              View recipe &rarr;
            </Link>
          </div>
        )}
        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/30 text-red-500 fred-med text-[14px] px-4 py-3 rounded-[10px] mb-6"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chicken Karahi"
              className={inputClass}
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your recipe..."
              rows={3}
              className={`${inputClass} resize-none`}
              required
            />
          </div>
          {/* Images — max 3 */}
          <div>
            <label className={labelClass}>
              Photos{" "}
              <span className="text-[var(--muted)] fred-light">
                ({images.length}/3)
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {/* Thumbnails of selected images */}
              {previewUrls.map((url, i) => (
                <div
                  key={url}
                  className="relative w-[100px] h-[100px] rounded-[10px] overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button — always visible so it also works on touch screens */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute top-1.5 right-1.5 w-[26px] h-[26px] rounded-full bg-black/60 hover:bg-black/80 transition-colors flex items-center justify-center text-white fred-bold text-[14px] leading-none"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* Add button — only show if under 3 images */}
              {images.length < 3 && (
                <label className="w-[100px] h-[100px] rounded-[10px] border-2 border-dashed border-[var(--border)] hover:border-[var(--secondary)] transition-colors flex flex-col items-center justify-center cursor-pointer text-[var(--muted)] hover:text-[var(--secondary)] focus-within:border-[var(--secondary)]">
                  <span className="text-[24px] leading-none">+</span>
                  <span className="fred-med text-[11px] mt-1">Add photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      addImages(e.target.files);
                      e.target.value = ""; // so picking the same file again still fires onChange
                    }}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className={labelClass}>Ingredients</label>
            <div className="flex flex-col gap-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    placeholder="Name"
                    className={`${inputClass} md:flex-[2]`}
                    required
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(i, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      className={`${inputClass} flex-1`}
                      required
                    />
                    <UnitPicker
                      value={ing.unitOfMeasurement}
                      onChange={(unit) =>
                        updateIngredient(i, "unitOfMeasurement", unit)
                      }
                      className="flex-1"
                    />
                    {/* Remove button — only show if more than one ingredient */}
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(i)}
                        aria-label={`Remove ingredient ${i + 1}`}
                        className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors text-[18px]"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 fred-med text-[13px] text-[var(--secondary)] hover:underline"
            >
              + Add ingredient
            </button>
          </div>
          {/* Instructions */}
          <div>
            <label className={labelClass}>Instructions</label>
            <div className="flex flex-col gap-3">
              {instructions.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  {/* Step number */}
                  <span className="shrink-0 w-[28px] h-[44px] flex items-center justify-center fred-bold text-[13px] text-[var(--primary)]/40">
                    {i + 1}.
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                    rows={2}
                    className={`${inputClass} resize-none flex-1`}
                    required
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      aria-label={`Remove step ${i + 1}`}
                      className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors text-[18px] mt-1"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="mt-2 fred-med text-[13px] text-[var(--secondary)] hover:underline"
            >
              + Add step
            </button>
          </div>
          {/* Prep time, Cook time, Servings — in a row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Prep Time (min)</label>
              <input
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) =>
                  setPrepTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="15"
                className={inputClass}
                required
                max={60*24}
              />
            </div>
            <div>
              <label className={labelClass}>Cook Time (min)</label>
              <input
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) =>
                  setCookTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="30"
                className={inputClass}
                required
                max={60*24}
              />
            </div>
            <div>
              <label className={labelClass}>Servings</label>
              <input
                type="number"
                min={1}
                value={servingCount}
                onChange={(e) =>
                  setServingCount(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="4"
                className={inputClass}
                required
                max={10}
              />
            </div>
          </div>
          {/* Categories — toggle chips */}
          <div>
            <label className={labelClass}>
              Categories{" "}
              <span className="text-[var(--muted)] fred-light">
                (pick at least one)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const selected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3.5 py-2 rounded-full text-[13px] fred-med transition-colors duration-200 ${
                      selected
                        ? "bg-[var(--secondary)] text-[var(--on-secondary)]"
                        : "bg-[var(--surface)] text-[var(--primary)]/60 md:border md:border-[var(--accent)] hover:bg-[var(--secondary)]/10"
                    }`}
                  >
                    {formatCategory(cat)}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-[10px] bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
