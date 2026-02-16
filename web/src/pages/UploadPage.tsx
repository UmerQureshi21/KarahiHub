import { useState } from "react";
import { postRecipe } from "../services/recipeService";
import type { IngredientRequest, RecipeRequest } from "../types";
import UnitPicker from "../components/UnitPicker";

// Matches the backend RecipeCategory enum values
const CATEGORIES = [
  "APPETIZER",
  "MAIN_COURSE",
  "DESSERT",
  "SIDE_DISH",
  "SOUP",
  "SALAD",
  "BREAKFAST",
  "SNACK",
  "BEVERAGE",
];

// Formats "MAIN_COURSE" → "Main Course" for display
const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

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
      await postRecipe(recipe);
      setSuccess(true);
      // Reset form
      setTitle("");
      setDescription("");
      setIngredients([{ ...emptyIngredient }]);
      setInstructions([""]);
      setPrepTime("");
      setCookTime("");
      setServingCount("");
      setSelectedCategories([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-[10px] border border-gray-200 fred-med text-[14px] text-[var(--primary)] outline-none focus:border-[var(--secondary)] transition-colors";

  const labelClass = "fred-med text-[14px] text-[var(--primary)] mb-1.5 block";

  return (
    <div className="p-[40px] md:rounded-[20px] md:my-[20px] max-w-[720px] md:bg-[var(--accent)] mx-auto">
      <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)] mb-2">
        Upload Recipe
      </h1>
      <p className="fred-light text-[15px] text-gray-500 mb-8">
        Share your favourite recipe with the community.
      </p>

      {/* Success banner */}
      {success && (
        <div className="bg-[var(--secondary)]/10 border border-[var(--secondary)]/30 text-[var(--secondary)] fred-med text-[14px] px-4 py-3 rounded-[10px] mb-6">
          Recipe uploaded successfully!
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 fred-med text-[14px] px-4 py-3 rounded-[10px] mb-6">
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
                      className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-[18px]"
                    >
                      x
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
                <span className="shrink-0 w-[28px] h-[44px] flex items-center justify-center fred-bold text-[13px] text-gray-400">
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
                    className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-[18px] mt-1"
                  >
                    x
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
            />
          </div>
        </div>

        {/* Categories — toggle chips */}
        <div>
          <label className={labelClass}>Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-[13px] fred-med transition-colors duration-200 ${
                    selected
                      ? "bg-[var(--secondary)] text-[var(--surface)]"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
          className="w-full py-3.5 rounded-[10px] bg-[var(--secondary)] text-[var(--surface)] fred-bold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
}
