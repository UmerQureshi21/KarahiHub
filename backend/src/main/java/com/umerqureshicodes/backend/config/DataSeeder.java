package com.umerqureshicodes.backend.config;

import com.umerqureshicodes.backend.entities.Ingredient;
import com.umerqureshicodes.backend.entities.Recipe;
import com.umerqureshicodes.backend.entities.RecipeCategory;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RecipeRepository recipeRepository;

    public DataSeeder(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public void run(String... args) {

        // 1. Chicken Karahi
        Recipe karahi = new Recipe();
        karahi.setUserId(1L);
        karahi.setTitle("Chicken Karahi");
        karahi.setDescription("A fiery Pakistani wok curry with tomatoes, green chilies, and fresh ginger.");
        karahi.setInstructions(List.of(
                "Heat oil in a karahi or wok on high heat.",
                "Add chicken and cook until browned.",
                "Add chopped tomatoes, salt, and red chili powder.",
                "Cook on high until tomatoes break down.",
                "Add green chilies, ginger julienne, and garam masala.",
                "Garnish with fresh coriander and serve with naan."
        ));
        karahi.setPrepTime(10);
        karahi.setCookTime(30);
        karahi.setServingCount(4);
        karahi.setCategories(List.of(RecipeCategory.MAIN_COURSE));
        karahi.setCreatedAt(new Date());
        karahi.setUpdatedAt(new Date());
        karahi.setRating(4.9);
        karahi.setIngredients(List.of(
                new Ingredient("chicken", "750", "grams", karahi),
                new Ingredient("tomatoes", "4", null, karahi),
                new Ingredient("green chilies", "4", null, karahi),
                new Ingredient("ginger", "2", "inches", karahi),
                new Ingredient("cooking oil", "4", "tbsp", karahi),
                new Ingredient("red chili powder", "1", "tsp", karahi),
                new Ingredient("garam masala", "1", "tsp", karahi),
                new Ingredient("salt", "1", "tsp", karahi),
                new Ingredient("fresh coriander", "1", "handful", karahi)
        ));

        // 2. Nihari
        Recipe nihari = new Recipe();
        nihari.setUserId(2L);
        nihari.setTitle("Nihari");
        nihari.setDescription("A slow-cooked beef stew with rich spices, traditionally eaten for breakfast in Pakistan.");
        nihari.setInstructions(List.of(
                "Sear beef shanks in hot oil until browned on all sides.",
                "Add onions and cook until golden.",
                "Add nihari masala, turmeric, chili powder, and salt.",
                "Pour in water and bring to a boil.",
                "Cover and slow cook on low heat for 4-5 hours until meat is fall-apart tender.",
                "Mix flour in water and stir into the stew to thicken.",
                "Garnish with ginger, green chilies, coriander, and a squeeze of lemon."
        ));
        nihari.setPrepTime(15);
        nihari.setCookTime(300);
        nihari.setServingCount(6);
        nihari.setCategories(List.of(RecipeCategory.MAIN_COURSE, RecipeCategory.BREAKFAST));
        nihari.setCreatedAt(new Date());
        nihari.setUpdatedAt(new Date());
        nihari.setRating(4.8);
        nihari.setIngredients(List.of(
                new Ingredient("beef shank", "1", "kg", nihari),
                new Ingredient("onions", "3", null, nihari),
                new Ingredient("nihari masala", "3", "tbsp", nihari),
                new Ingredient("wheat flour", "2", "tbsp", nihari),
                new Ingredient("cooking oil", "0.5", "cup", nihari),
                new Ingredient("turmeric", "0.5", "tsp", nihari),
                new Ingredient("red chili powder", "1", "tsp", nihari),
                new Ingredient("salt", "2", "tsp", nihari),
                new Ingredient("ginger", "2", "inches", nihari),
                new Ingredient("green chilies", "3", null, nihari),
                new Ingredient("lemon", "1", null, nihari),
                new Ingredient("fresh coriander", "1", "handful", nihari)
        ));

        // 3. Dahi Bhalle
        Recipe dahiBhalle = new Recipe();
        dahiBhalle.setUserId(1L);
        dahiBhalle.setTitle("Dahi Bhalle");
        dahiBhalle.setDescription("Soft lentil dumplings soaked in creamy yogurt and topped with tangy chutneys.");
        dahiBhalle.setInstructions(List.of(
                "Soak urad dal for 4 hours then grind into a smooth batter.",
                "Deep fry spoonfuls of batter until golden.",
                "Soak the bhalle in warm water for 20 minutes, then squeeze out water.",
                "Whisk yogurt with salt and sugar.",
                "Place bhalle in yogurt and top with tamarind chutney, chaat masala, and cumin."
        ));
        dahiBhalle.setPrepTime(30);
        dahiBhalle.setCookTime(25);
        dahiBhalle.setServingCount(4);
        dahiBhalle.setCategories(List.of(RecipeCategory.APPETIZER, RecipeCategory.SNACK));
        dahiBhalle.setCreatedAt(new Date());
        dahiBhalle.setUpdatedAt(new Date());
        dahiBhalle.setRating(4.5);
        dahiBhalle.setIngredients(List.of(
                new Ingredient("urad dal", "1", "cup", dahiBhalle),
                new Ingredient("yogurt", "2", "cups", dahiBhalle),
                new Ingredient("tamarind chutney", "3", "tbsp", dahiBhalle),
                new Ingredient("chaat masala", "1", "tsp", dahiBhalle),
                new Ingredient("cumin powder", "0.5", "tsp", dahiBhalle),
                new Ingredient("salt", "1", "tsp", dahiBhalle),
                new Ingredient("oil for frying", "2", "cups", dahiBhalle)
        ));

        // 4. Chapli Kebab
        Recipe chapliKebab = new Recipe();
        chapliKebab.setUserId(3L);
        chapliKebab.setTitle("Chapli Kebab");
        chapliKebab.setDescription("Peshawari-style spiced beef patties loaded with tomatoes, onions, and fresh herbs.");
        chapliKebab.setInstructions(List.of(
                "Mix mince with all spices, chopped tomatoes, onions, coriander, and egg.",
                "Let the mixture rest for 30 minutes.",
                "Shape into flat round patties.",
                "Shallow fry in oil on medium heat until crispy on both sides.",
                "Serve with naan and green chutney."
        ));
        chapliKebab.setPrepTime(40);
        chapliKebab.setCookTime(20);
        chapliKebab.setServingCount(4);
        chapliKebab.setCategories(List.of(RecipeCategory.MAIN_COURSE, RecipeCategory.SNACK));
        chapliKebab.setCreatedAt(new Date());
        chapliKebab.setUpdatedAt(new Date());
        chapliKebab.setRating(4.7);
        chapliKebab.setIngredients(List.of(
                new Ingredient("beef mince", "500", "grams", chapliKebab),
                new Ingredient("onion", "1", null, chapliKebab),
                new Ingredient("tomato", "2", null, chapliKebab),
                new Ingredient("egg", "1", null, chapliKebab),
                new Ingredient("fresh coriander", "1", "handful", chapliKebab),
                new Ingredient("cumin seeds", "1", "tsp", chapliKebab),
                new Ingredient("coriander seeds", "1", "tbsp", chapliKebab),
                new Ingredient("red chili flakes", "1", "tsp", chapliKebab),
                new Ingredient("salt", "1", "tsp", chapliKebab),
                new Ingredient("cooking oil", "0.5", "cup", chapliKebab)
        ));

        recipeRepository.saveAll(List.of(karahi, nihari, dahiBhalle, chapliKebab));
    }
}
