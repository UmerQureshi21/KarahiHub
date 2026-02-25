package com.umerqureshicodes.backend.config;

import com.umerqureshicodes.backend.entities.*;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import com.umerqureshicodes.backend.repositories.CategoryRepository;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RecipeRepository recipeRepository;
    private final AppUserRepository appUserRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RecipeRepository recipeRepository, AppUserRepository appUserRepository,
                      CategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
        this.recipeRepository = recipeRepository;
        this.appUserRepository = appUserRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Seed all category rows — one per enum value
        // These are fixed reference data, so we save them before any recipes
        List<Category> allCategories = new ArrayList<>();
        for (RecipeCategory rc : RecipeCategory.values()) {
            allCategories.add(new Category(rc, new ArrayList<>()));
        }
        categoryRepository.saveAll(allCategories);

        // Look up saved Category entities by enum value
        Category mainCourse = categoryRepository.findById(RecipeCategory.MAIN_COURSE).orElseThrow();
        Category breakfast = categoryRepository.findById(RecipeCategory.BREAKFAST).orElseThrow();
        Category appetizer = categoryRepository.findById(RecipeCategory.APPETIZER).orElseThrow();
        Category snack = categoryRepository.findById(RecipeCategory.SNACK).orElseThrow();
        Category dessert = categoryRepository.findById(RecipeCategory.DESSERT).orElseThrow();
        Category sideDish = categoryRepository.findById(RecipeCategory.SIDE_DISH).orElseThrow();
        Category soup = categoryRepository.findById(RecipeCategory.SOUP).orElseThrow();
        Category beverage = categoryRepository.findById(RecipeCategory.BEVERAGE).orElseThrow();
        Category salad = categoryRepository.findById(RecipeCategory.SALAD).orElseThrow();

        // Create mock user
        AppUser vishav = new AppUser("purewal@gmail.com", "Vishav", passwordEncoder.encode("mypassword"));
        appUserRepository.save(vishav);

        // 1. Chicken Karahi
        Recipe karahi = new Recipe();
        karahi.setAppUser(vishav);
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
        karahi.setCategories(List.of(mainCourse));
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
        karahi.setImages(List.of(new RecipeImage("recipes/1/biryani.jpg", karahi)));

        // 2. Nihari
        Recipe nihari = new Recipe();
        nihari.setAppUser(vishav);
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
        nihari.setCategories(List.of(mainCourse, breakfast));
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
        nihari.setImages(List.of(new RecipeImage("recipes/2/nihari.jpg", nihari)));

        // 3. Dahi Bhalle
        Recipe dahiBhalle = new Recipe();
        dahiBhalle.setAppUser(vishav);
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
        dahiBhalle.setCategories(List.of(appetizer, snack));
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
        dahiBhalle.setImages(List.of(new RecipeImage("recipes/3/raita.jpg", dahiBhalle)));

        // 4. Chapli Kebab
        Recipe chapliKebab = new Recipe();
        chapliKebab.setAppUser(vishav);
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
        chapliKebab.setCategories(List.of(mainCourse, snack));
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
        chapliKebab.setImages(List.of(new RecipeImage("recipes/4/charga.jpg", chapliKebab)));

        recipeRepository.saveAll(List.of(karahi, nihari, dahiBhalle, chapliKebab));

        // Second mock user
        AppUser amna = new AppUser("amna@gmail.com", "Amna", passwordEncoder.encode("mypassword"));
        appUserRepository.save(amna);

        // 5. Halwa Puri (breakfast + dessert + sideDish — 3 categories)
        Recipe halwaPuri = new Recipe();
        halwaPuri.setAppUser(amna);
        halwaPuri.setTitle("Halwa Puri");
        halwaPuri.setDescription("Classic Pakistani Sunday breakfast — sweet semolina halwa with deep-fried puri and spicy chana.");
        halwaPuri.setInstructions(List.of(
                "Roast semolina in ghee until golden and fragrant.",
                "Add sugar and water, stir until halwa thickens.",
                "Add cardamom and food colour, mix well.",
                "Knead flour with salt and oil into a soft dough for puri.",
                "Roll into small circles and deep fry until puffed and golden.",
                "Serve halwa and puri together with chana masala."
        ));
        halwaPuri.setPrepTime(20);
        halwaPuri.setCookTime(40);
        halwaPuri.setServingCount(6);
        halwaPuri.setCategories(List.of(breakfast, dessert, sideDish));
        halwaPuri.setCreatedAt(new Date());
        halwaPuri.setUpdatedAt(new Date());
        halwaPuri.setRating(4.6);
        halwaPuri.setIngredients(List.of(
                new Ingredient("semolina", "2", "cups", halwaPuri),
                new Ingredient("ghee", "0.5", "cup", halwaPuri),
                new Ingredient("sugar", "1", "cup", halwaPuri),
                new Ingredient("cardamom", "4", null, halwaPuri),
                new Ingredient("flour", "2", "cups", halwaPuri),
                new Ingredient("oil for frying", "2", "cups", halwaPuri),
                new Ingredient("salt", "0.5", "tsp", halwaPuri)
        ));
        halwaPuri.setImages(List.of(new RecipeImage("recipes/5/jalebi.jpg", halwaPuri)));

        // 6. Mango Lassi (beverage — 1 category, quick recipe)
        Recipe mangoLassi = new Recipe();
        mangoLassi.setAppUser(amna);
        mangoLassi.setTitle("Mango Lassi");
        mangoLassi.setDescription("A creamy, chilled yogurt drink blended with sweet mango pulp and a hint of cardamom.");
        mangoLassi.setInstructions(List.of(
                "Blend mango pulp, yogurt, sugar, and cardamom until smooth.",
                "Add ice cubes and blend again.",
                "Pour into glasses and serve chilled."
        ));
        mangoLassi.setPrepTime(5);
        mangoLassi.setCookTime(0);
        mangoLassi.setServingCount(2);
        mangoLassi.setCategories(List.of(beverage));
        mangoLassi.setCreatedAt(new Date());
        mangoLassi.setUpdatedAt(new Date());
        mangoLassi.setRating(4.4);
        mangoLassi.setIngredients(List.of(
                new Ingredient("mango pulp", "1", "cup", mangoLassi),
                new Ingredient("yogurt", "1", "cup", mangoLassi),
                new Ingredient("sugar", "2", "tbsp", mangoLassi),
                new Ingredient("cardamom powder", "0.25", "tsp", mangoLassi),
                new Ingredient("ice cubes", "4", null, mangoLassi)
        ));
        mangoLassi.setImages(List.of(new RecipeImage("recipes/6/mango-lassi.jpg", mangoLassi)));

        // 7. Paya (soup + mainCourse + breakfast — 3 categories, long cook time)
        Recipe paya = new Recipe();
        paya.setAppUser(amna);
        paya.setTitle("Paya");
        paya.setDescription("Slow-cooked trotters in a rich, gelatinous bone broth loaded with warm spices.");
        paya.setInstructions(List.of(
                "Clean and wash trotters thoroughly.",
                "Pressure cook trotters with water, salt, and turmeric for 45 minutes.",
                "In a separate pot, fry onions until deep golden.",
                "Add ginger-garlic paste, whole spices, and chili powder.",
                "Add the cooked trotters with their broth and simmer for 2 hours.",
                "Garnish with ginger, green chilies, and fresh coriander."
        ));
        paya.setPrepTime(20);
        paya.setCookTime(180);
        paya.setServingCount(5);
        paya.setCategories(List.of(soup, mainCourse, breakfast));
        paya.setCreatedAt(new Date());
        paya.setUpdatedAt(new Date());
        paya.setRating(4.7);
        paya.setIngredients(List.of(
                new Ingredient("trotters", "4", null, paya),
                new Ingredient("onions", "3", null, paya),
                new Ingredient("ginger-garlic paste", "2", "tbsp", paya),
                new Ingredient("whole spices", "1", "tbsp", paya),
                new Ingredient("red chili powder", "1", "tsp", paya),
                new Ingredient("turmeric", "0.5", "tsp", paya),
                new Ingredient("cooking oil", "0.5", "cup", paya),
                new Ingredient("salt", "2", "tsp", paya),
                new Ingredient("green chilies", "4", null, paya),
                new Ingredient("fresh coriander", "1", "handful", paya)
        ));
        paya.setImages(List.of(new RecipeImage("recipes/7/palak-gosht.jpg", paya)));

        // 8. Kachumber Salad (salad + sideDish — 2 categories, no cook time)
        Recipe kachumber = new Recipe();
        kachumber.setAppUser(amna);
        kachumber.setTitle("Kachumber Salad");
        kachumber.setDescription("A fresh and crunchy South Asian salad of diced onions, tomatoes, and cucumbers with lemon and chaat masala.");
        kachumber.setInstructions(List.of(
                "Dice onions, tomatoes, and cucumbers into small even pieces.",
                "Finely chop green chilies and fresh coriander.",
                "Toss everything together in a bowl.",
                "Squeeze lemon juice, sprinkle salt and chaat masala, and mix well.",
                "Serve immediately as a side."
        ));
        kachumber.setPrepTime(10);
        kachumber.setCookTime(0);
        kachumber.setServingCount(4);
        kachumber.setCategories(List.of(salad, sideDish));
        kachumber.setCreatedAt(new Date());
        kachumber.setUpdatedAt(new Date());
        kachumber.setRating(4.0);
        kachumber.setIngredients(List.of(
                new Ingredient("onion", "1", null, kachumber),
                new Ingredient("tomato", "2", null, kachumber),
                new Ingredient("cucumber", "1", null, kachumber),
                new Ingredient("green chili", "1", null, kachumber),
                new Ingredient("lemon", "1", null, kachumber),
                new Ingredient("chaat masala", "0.5", "tsp", kachumber),
                new Ingredient("salt", "0.5", "tsp", kachumber),
                new Ingredient("fresh coriander", "1", "handful", kachumber)
        ));
        kachumber.setImages(List.of(new RecipeImage("recipes/8/raita.jpg", kachumber)));

        // 9. Gulab Jamun (dessert + snack — 2 categories)
        Recipe gulabJamun = new Recipe();
        gulabJamun.setAppUser(amna);
        gulabJamun.setTitle("Gulab Jamun");
        gulabJamun.setDescription("Soft, spongy milk-solid dumplings soaked in rose-scented sugar syrup.");
        gulabJamun.setInstructions(List.of(
                "Mix milk powder, flour, and baking soda together.",
                "Add ghee and milk gradually to form a soft dough — don't overknead.",
                "Roll into smooth, crack-free balls.",
                "Deep fry on low heat until deep golden brown.",
                "Boil sugar with water and cardamom to make syrup.",
                "Add a few drops of rose water to the syrup.",
                "Soak the fried balls in warm syrup for at least 30 minutes before serving."
        ));
        gulabJamun.setPrepTime(25);
        gulabJamun.setCookTime(35);
        gulabJamun.setServingCount(8);
        gulabJamun.setCategories(List.of(dessert, snack));
        gulabJamun.setCreatedAt(new Date());
        gulabJamun.setUpdatedAt(new Date());
        gulabJamun.setRating(4.8);
        gulabJamun.setIngredients(List.of(
                new Ingredient("milk powder", "1", "cup", gulabJamun),
                new Ingredient("flour", "3", "tbsp", gulabJamun),
                new Ingredient("baking soda", "0.25", "tsp", gulabJamun),
                new Ingredient("ghee", "1", "tbsp", gulabJamun),
                new Ingredient("milk", "3", "tbsp", gulabJamun),
                new Ingredient("sugar", "1.5", "cups", gulabJamun),
                new Ingredient("cardamom", "3", null, gulabJamun),
                new Ingredient("rose water", "1", "tsp", gulabJamun),
                new Ingredient("oil for frying", "2", "cups", gulabJamun)
        ));
        gulabJamun.setImages(List.of(new RecipeImage("recipes/9/jalebi.jpg", gulabJamun)));

        recipeRepository.saveAll(List.of(halwaPuri, mangoLassi, paya, kachumber, gulabJamun));
    }
}
