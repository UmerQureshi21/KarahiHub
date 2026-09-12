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

        // Third mock user for more variety
        AppUser fatima = new AppUser("fatima@gmail.com", "Fatima", passwordEncoder.encode("mypassword"));
        appUserRepository.save(fatima);

        // 10. Biryani
        Recipe biryani = new Recipe();
        biryani.setAppUser(fatima);
        biryani.setTitle("Chicken Biryani");
        biryani.setDescription("Fragrant basmati rice layered with spiced chicken, fried onions, and saffron.");
        biryani.setInstructions(List.of(
                "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes.",
                "Parboil basmati rice with whole spices until 70% cooked.",
                "Fry onions until golden brown and crispy.",
                "Layer marinated chicken in a heavy-bottomed pot.",
                "Top with rice, fried onions, mint, and saffron milk.",
                "Cover tightly and cook on dum (low heat) for 25 minutes.",
                "Garnish with boiled eggs and serve with raita."
        ));
        biryani.setPrepTime(45);
        biryani.setCookTime(50);
        biryani.setServingCount(6);
        biryani.setCategories(List.of(mainCourse));
        biryani.setCreatedAt(new Date());
        biryani.setUpdatedAt(new Date());
        biryani.setRating(4.9);
        biryani.setIngredients(List.of(
                new Ingredient("chicken", "1", "kg", biryani),
                new Ingredient("basmati rice", "3", "cups", biryani),
                new Ingredient("yogurt", "1", "cup", biryani),
                new Ingredient("onions", "3", null, biryani),
                new Ingredient("ginger-garlic paste", "2", "tbsp", biryani),
                new Ingredient("biryani masala", "2", "tbsp", biryani),
                new Ingredient("saffron", "1", "pinch", biryani),
                new Ingredient("mint leaves", "1", "handful", biryani),
                new Ingredient("cooking oil", "0.5", "cup", biryani)
        ));
        biryani.setImages(List.of());

        // 11. Seekh Kebab
        Recipe seekhKebab = new Recipe();
        seekhKebab.setAppUser(fatima);
        seekhKebab.setTitle("Seekh Kebab");
        seekhKebab.setDescription("Juicy minced meat skewers grilled to perfection with aromatic spices.");
        seekhKebab.setInstructions(List.of(
                "Mix mince with onions, green chilies, coriander, and spices.",
                "Add ginger-garlic paste and gram flour to bind.",
                "Mold the mixture onto skewers.",
                "Grill over charcoal or in an oven until charred and cooked through.",
                "Serve with naan and mint chutney."
        ));
        seekhKebab.setPrepTime(30);
        seekhKebab.setCookTime(20);
        seekhKebab.setServingCount(4);
        seekhKebab.setCategories(List.of(mainCourse, appetizer));
        seekhKebab.setCreatedAt(new Date());
        seekhKebab.setUpdatedAt(new Date());
        seekhKebab.setRating(4.7);
        seekhKebab.setIngredients(List.of(
                new Ingredient("beef mince", "500", "grams", seekhKebab),
                new Ingredient("onion", "1", null, seekhKebab),
                new Ingredient("green chilies", "3", null, seekhKebab),
                new Ingredient("fresh coriander", "1", "handful", seekhKebab),
                new Ingredient("ginger-garlic paste", "1", "tbsp", seekhKebab),
                new Ingredient("gram flour", "2", "tbsp", seekhKebab),
                new Ingredient("cumin powder", "1", "tsp", seekhKebab),
                new Ingredient("garam masala", "1", "tsp", seekhKebab)
        ));
        seekhKebab.setImages(List.of());

        // 12. Aloo Gosht
        Recipe alooGosht = new Recipe();
        alooGosht.setAppUser(fatima);
        alooGosht.setTitle("Aloo Gosht");
        alooGosht.setDescription("Tender mutton cooked with potatoes in a rich, spicy gravy.");
        alooGosht.setInstructions(List.of(
                "Brown mutton pieces in oil.",
                "Add onions and cook until golden.",
                "Add tomatoes, ginger-garlic paste, and spices.",
                "Pour water and cook until meat is 80% done.",
                "Add potatoes and cook until both are tender.",
                "Garnish with coriander and green chilies."
        ));
        alooGosht.setPrepTime(20);
        alooGosht.setCookTime(60);
        alooGosht.setServingCount(5);
        alooGosht.setCategories(List.of(mainCourse));
        alooGosht.setCreatedAt(new Date());
        alooGosht.setUpdatedAt(new Date());
        alooGosht.setRating(4.6);
        alooGosht.setIngredients(List.of(
                new Ingredient("mutton", "750", "grams", alooGosht),
                new Ingredient("potatoes", "4", null, alooGosht),
                new Ingredient("onions", "2", null, alooGosht),
                new Ingredient("tomatoes", "3", null, alooGosht),
                new Ingredient("ginger-garlic paste", "2", "tbsp", alooGosht),
                new Ingredient("red chili powder", "1", "tsp", alooGosht),
                new Ingredient("turmeric", "0.5", "tsp", alooGosht)
        ));
        alooGosht.setImages(List.of());

        // 13. Palak Paneer (Pakistani style)
        Recipe palakPaneer = new Recipe();
        palakPaneer.setAppUser(fatima);
        palakPaneer.setTitle("Palak Paneer");
        palakPaneer.setDescription("Soft paneer cubes in a creamy spinach gravy with Pakistani spices.");
        palakPaneer.setInstructions(List.of(
                "Blanch spinach and blend into a smooth puree.",
                "Fry paneer cubes until golden and set aside.",
                "In the same pan, cook onions, tomatoes, and spices.",
                "Add spinach puree and cook for 10 minutes.",
                "Add paneer and cream, simmer for 5 minutes.",
                "Serve with naan or roti."
        ));
        palakPaneer.setPrepTime(20);
        palakPaneer.setCookTime(30);
        palakPaneer.setServingCount(4);
        palakPaneer.setCategories(List.of(mainCourse, sideDish));
        palakPaneer.setCreatedAt(new Date());
        palakPaneer.setUpdatedAt(new Date());
        palakPaneer.setRating(4.5);
        palakPaneer.setIngredients(List.of(
                new Ingredient("spinach", "500", "grams", palakPaneer),
                new Ingredient("paneer", "250", "grams", palakPaneer),
                new Ingredient("onions", "2", null, palakPaneer),
                new Ingredient("tomatoes", "2", null, palakPaneer),
                new Ingredient("cream", "0.25", "cup", palakPaneer),
                new Ingredient("garam masala", "1", "tsp", palakPaneer)
        ));
        palakPaneer.setImages(List.of());

        // 14. Samosa
        Recipe samosa = new Recipe();
        samosa.setAppUser(fatima);
        samosa.setTitle("Samosa");
        samosa.setDescription("Crispy triangular pastries filled with spiced potatoes and peas.");
        samosa.setInstructions(List.of(
                "Boil and mash potatoes with peas and spices.",
                "Make a dough with flour, salt, and oil.",
                "Roll into thin sheets and cut into strips.",
                "Fill with potato mixture and fold into triangles.",
                "Deep fry until golden and crispy.",
                "Serve with tamarind chutney."
        ));
        samosa.setPrepTime(40);
        samosa.setCookTime(25);
        samosa.setServingCount(8);
        samosa.setCategories(List.of(appetizer, snack));
        samosa.setCreatedAt(new Date());
        samosa.setUpdatedAt(new Date());
        samosa.setRating(4.8);
        samosa.setIngredients(List.of(
                new Ingredient("potatoes", "4", null, samosa),
                new Ingredient("peas", "0.5", "cup", samosa),
                new Ingredient("flour", "2", "cups", samosa),
                new Ingredient("cumin seeds", "1", "tsp", samosa),
                new Ingredient("garam masala", "1", "tsp", samosa),
                new Ingredient("oil for frying", "2", "cups", samosa)
        ));
        samosa.setImages(List.of());

        // 15. Pakora
        Recipe pakora = new Recipe();
        pakora.setAppUser(fatima);
        pakora.setTitle("Vegetable Pakora");
        pakora.setDescription("Crispy gram flour fritters with mixed vegetables, perfect for rainy days.");
        pakora.setInstructions(List.of(
                "Mix gram flour with spices and a little water to make thick batter.",
                "Add sliced onions, potatoes, and spinach.",
                "Drop spoonfuls into hot oil.",
                "Fry until golden and crispy.",
                "Serve hot with ketchup or chutney."
        ));
        pakora.setPrepTime(15);
        pakora.setCookTime(20);
        pakora.setServingCount(4);
        pakora.setCategories(List.of(appetizer, snack));
        pakora.setCreatedAt(new Date());
        pakora.setUpdatedAt(new Date());
        pakora.setRating(4.4);
        pakora.setIngredients(List.of(
                new Ingredient("gram flour", "1", "cup", pakora),
                new Ingredient("onion", "1", null, pakora),
                new Ingredient("potato", "1", null, pakora),
                new Ingredient("spinach", "1", "handful", pakora),
                new Ingredient("red chili powder", "1", "tsp", pakora),
                new Ingredient("salt", "1", "tsp", pakora)
        ));
        pakora.setImages(List.of());

        recipeRepository.saveAll(List.of(biryani, seekhKebab, alooGosht, palakPaneer, samosa, pakora));

        // Fourth user for fusion recipes
        AppUser hassan = new AppUser("hassan@gmail.com", "Hassan", passwordEncoder.encode("mypassword"));
        appUserRepository.save(hassan);

        // 16. Pakistani Tacos
        Recipe pakTacos = new Recipe();
        pakTacos.setAppUser(hassan);
        pakTacos.setTitle("Pakistani Tacos");
        pakTacos.setDescription("Fusion tacos filled with seekh kebab, raita, and tangy chutneys.");
        pakTacos.setInstructions(List.of(
                "Prepare seekh kebab and cut into small pieces.",
                "Warm taco shells.",
                "Fill with kebab, shredded lettuce, and diced tomatoes.",
                "Drizzle with mint chutney and raita.",
                "Top with chopped onions and coriander."
        ));
        pakTacos.setPrepTime(25);
        pakTacos.setCookTime(15);
        pakTacos.setServingCount(4);
        pakTacos.setCategories(List.of(mainCourse, snack));
        pakTacos.setCreatedAt(new Date());
        pakTacos.setUpdatedAt(new Date());
        pakTacos.setRating(4.6);
        pakTacos.setIngredients(List.of(
                new Ingredient("seekh kebab", "4", "pieces", pakTacos),
                new Ingredient("taco shells", "8", null, pakTacos),
                new Ingredient("lettuce", "1", "cup", pakTacos),
                new Ingredient("tomatoes", "2", null, pakTacos),
                new Ingredient("raita", "0.5", "cup", pakTacos),
                new Ingredient("mint chutney", "3", "tbsp", pakTacos)
        ));
        pakTacos.setImages(List.of());

        // 17. Tandoori Chicken Pizza
        Recipe tandooriPizza = new Recipe();
        tandooriPizza.setAppUser(hassan);
        tandooriPizza.setTitle("Tandoori Chicken Pizza");
        tandooriPizza.setDescription("Pizza topped with tandoori chicken, bell peppers, and a drizzle of mint sauce.");
        tandooriPizza.setInstructions(List.of(
                "Marinate chicken with tandoori spices and yogurt.",
                "Grill or bake the chicken until cooked.",
                "Spread pizza sauce on dough.",
                "Top with mozzarella, tandoori chicken, onions, and bell peppers.",
                "Bake at 220C until crust is golden.",
                "Drizzle with mint sauce before serving."
        ));
        tandooriPizza.setPrepTime(30);
        tandooriPizza.setCookTime(25);
        tandooriPizza.setServingCount(4);
        tandooriPizza.setCategories(List.of(mainCourse, snack));
        tandooriPizza.setCreatedAt(new Date());
        tandooriPizza.setUpdatedAt(new Date());
        tandooriPizza.setRating(4.7);
        tandooriPizza.setIngredients(List.of(
                new Ingredient("chicken breast", "2", null, tandooriPizza),
                new Ingredient("pizza dough", "1", null, tandooriPizza),
                new Ingredient("tandoori masala", "2", "tbsp", tandooriPizza),
                new Ingredient("mozzarella cheese", "1", "cup", tandooriPizza),
                new Ingredient("bell peppers", "1", null, tandooriPizza),
                new Ingredient("pizza sauce", "0.5", "cup", tandooriPizza)
        ));
        tandooriPizza.setImages(List.of());

        // 18. Spicy Chicken Burger
        Recipe chickenBurger = new Recipe();
        chickenBurger.setAppUser(hassan);
        chickenBurger.setTitle("Pakistani Chicken Burger");
        chickenBurger.setDescription("Juicy chicken patty spiced with Pakistani masala, topped with chili sauce and veggies.");
        chickenBurger.setInstructions(List.of(
                "Mix chicken mince with garam masala, chili powder, and coriander.",
                "Form into patties and grill or pan-fry.",
                "Toast burger buns.",
                "Assemble with lettuce, tomato, onion, and patty.",
                "Top with spicy mayo and chili sauce."
        ));
        chickenBurger.setPrepTime(20);
        chickenBurger.setCookTime(15);
        chickenBurger.setServingCount(4);
        chickenBurger.setCategories(List.of(mainCourse, snack));
        chickenBurger.setCreatedAt(new Date());
        chickenBurger.setUpdatedAt(new Date());
        chickenBurger.setRating(4.5);
        chickenBurger.setIngredients(List.of(
                new Ingredient("chicken mince", "400", "grams", chickenBurger),
                new Ingredient("burger buns", "4", null, chickenBurger),
                new Ingredient("garam masala", "1", "tsp", chickenBurger),
                new Ingredient("lettuce", "4", "leaves", chickenBurger),
                new Ingredient("tomato", "1", null, chickenBurger),
                new Ingredient("chili sauce", "3", "tbsp", chickenBurger)
        ));
        chickenBurger.setImages(List.of());

        // 19. Chai Tea Latte
        Recipe chai = new Recipe();
        chai.setAppUser(hassan);
        chai.setTitle("Doodh Patti Chai");
        chai.setDescription("Creamy Pakistani milk tea brewed with strong black tea and cardamom.");
        chai.setInstructions(List.of(
                "Boil water with tea leaves and cardamom.",
                "Add milk and sugar.",
                "Simmer until tea is strong and aromatic.",
                "Strain and serve hot."
        ));
        chai.setPrepTime(5);
        chai.setCookTime(10);
        chai.setServingCount(2);
        chai.setCategories(List.of(beverage));
        chai.setCreatedAt(new Date());
        chai.setUpdatedAt(new Date());
        chai.setRating(4.9);
        chai.setIngredients(List.of(
                new Ingredient("black tea leaves", "2", "tsp", chai),
                new Ingredient("milk", "2", "cups", chai),
                new Ingredient("water", "0.5", "cup", chai),
                new Ingredient("sugar", "2", "tbsp", chai),
                new Ingredient("cardamom", "2", null, chai)
        ));
        chai.setImages(List.of());

        // 20. Chana Chaat
        Recipe chanaChaat = new Recipe();
        chanaChaat.setAppUser(hassan);
        chanaChaat.setTitle("Chana Chaat");
        chanaChaat.setDescription("Tangy chickpea salad with onions, tomatoes, and chaat masala.");
        chanaChaat.setInstructions(List.of(
                "Boil chickpeas until tender.",
                "Mix with diced onions, tomatoes, and green chilies.",
                "Add lemon juice, chaat masala, and salt.",
                "Garnish with coriander and serve immediately."
        ));
        chanaChaat.setPrepTime(15);
        chanaChaat.setCookTime(30);
        chanaChaat.setServingCount(4);
        chanaChaat.setCategories(List.of(salad, snack, appetizer));
        chanaChaat.setCreatedAt(new Date());
        chanaChaat.setUpdatedAt(new Date());
        chanaChaat.setRating(4.3);
        chanaChaat.setIngredients(List.of(
                new Ingredient("chickpeas", "1", "cup", chanaChaat),
                new Ingredient("onion", "1", null, chanaChaat),
                new Ingredient("tomato", "2", null, chanaChaat),
                new Ingredient("green chili", "1", null, chanaChaat),
                new Ingredient("lemon", "1", null, chanaChaat),
                new Ingredient("chaat masala", "1", "tsp", chanaChaat)
        ));
        chanaChaat.setImages(List.of());

        // 21. Shami Kebab
        Recipe shamiKebab = new Recipe();
        shamiKebab.setAppUser(hassan);
        shamiKebab.setTitle("Shami Kebab");
        shamiKebab.setDescription("Soft, melt-in-mouth lentil and meat patties with aromatic spices.");
        shamiKebab.setInstructions(List.of(
                "Boil meat with chana dal and whole spices until tender.",
                "Grind into a smooth paste.",
                "Add onions, green chilies, and egg to bind.",
                "Shape into flat patties.",
                "Shallow fry until golden on both sides.",
                "Serve with chutney."
        ));
        shamiKebab.setPrepTime(30);
        shamiKebab.setCookTime(60);
        shamiKebab.setServingCount(6);
        shamiKebab.setCategories(List.of(appetizer, mainCourse));
        shamiKebab.setCreatedAt(new Date());
        shamiKebab.setUpdatedAt(new Date());
        shamiKebab.setRating(4.8);
        shamiKebab.setIngredients(List.of(
                new Ingredient("beef", "500", "grams", shamiKebab),
                new Ingredient("chana dal", "0.5", "cup", shamiKebab),
                new Ingredient("onion", "1", null, shamiKebab),
                new Ingredient("egg", "1", null, shamiKebab),
                new Ingredient("green chilies", "2", null, shamiKebab),
                new Ingredient("whole spices", "1", "tbsp", shamiKebab)
        ));
        shamiKebab.setImages(List.of());

        recipeRepository.saveAll(List.of(pakTacos, tandooriPizza, chickenBurger, chai, chanaChaat, shamiKebab));

        // Fifth user
        AppUser zara = new AppUser("zara@gmail.com", "Zara", passwordEncoder.encode("mypassword"));
        appUserRepository.save(zara);

        // 22. Aloo Paratha
        Recipe alooParatha = new Recipe();
        alooParatha.setAppUser(zara);
        alooParatha.setTitle("Aloo Paratha");
        alooParatha.setDescription("Whole wheat flatbread stuffed with spiced mashed potatoes.");
        alooParatha.setInstructions(List.of(
                "Boil and mash potatoes with green chilies, coriander, and spices.",
                "Make dough with whole wheat flour.",
                "Roll dough, stuff with potato filling.",
                "Seal and roll flat again.",
                "Cook on tawa with ghee until golden spots appear.",
                "Serve with yogurt or pickle."
        ));
        alooParatha.setPrepTime(25);
        alooParatha.setCookTime(20);
        alooParatha.setServingCount(4);
        alooParatha.setCategories(List.of(breakfast, mainCourse));
        alooParatha.setCreatedAt(new Date());
        alooParatha.setUpdatedAt(new Date());
        alooParatha.setRating(4.7);
        alooParatha.setIngredients(List.of(
                new Ingredient("whole wheat flour", "2", "cups", alooParatha),
                new Ingredient("potatoes", "3", null, alooParatha),
                new Ingredient("green chilies", "2", null, alooParatha),
                new Ingredient("coriander", "1", "handful", alooParatha),
                new Ingredient("ghee", "3", "tbsp", alooParatha)
        ));
        alooParatha.setImages(List.of());

        // 23. Chicken Tikka
        Recipe chickenTikka = new Recipe();
        chickenTikka.setAppUser(zara);
        chickenTikka.setTitle("Chicken Tikka");
        chickenTikka.setDescription("Tender chicken pieces marinated in yogurt and spices, grilled to perfection.");
        chickenTikka.setInstructions(List.of(
                "Cut chicken into cubes.",
                "Marinate with yogurt, tikka masala, lemon juice, and ginger-garlic paste.",
                "Let it sit for 2 hours.",
                "Skewer the chicken pieces.",
                "Grill or bake until charred and cooked.",
                "Serve with naan and chutney."
        ));
        chickenTikka.setPrepTime(130);
        chickenTikka.setCookTime(20);
        chickenTikka.setServingCount(4);
        chickenTikka.setCategories(List.of(mainCourse, appetizer));
        chickenTikka.setCreatedAt(new Date());
        chickenTikka.setUpdatedAt(new Date());
        chickenTikka.setRating(4.9);
        chickenTikka.setIngredients(List.of(
                new Ingredient("chicken breast", "500", "grams", chickenTikka),
                new Ingredient("yogurt", "1", "cup", chickenTikka),
                new Ingredient("tikka masala", "2", "tbsp", chickenTikka),
                new Ingredient("lemon juice", "2", "tbsp", chickenTikka),
                new Ingredient("ginger-garlic paste", "1", "tbsp", chickenTikka)
        ));
        chickenTikka.setImages(List.of());

        // 24. Kheer
        Recipe kheer = new Recipe();
        kheer.setAppUser(zara);
        kheer.setTitle("Kheer (Rice Pudding)");
        kheer.setDescription("Creamy rice pudding flavored with cardamom, saffron, and nuts.");
        kheer.setInstructions(List.of(
                "Boil milk in a heavy-bottomed pan.",
                "Add washed rice and cook on low heat, stirring frequently.",
                "Add sugar, cardamom, and saffron.",
                "Cook until rice is soft and pudding is thick.",
                "Garnish with almonds and pistachios.",
                "Serve warm or chilled."
        ));
        kheer.setPrepTime(10);
        kheer.setCookTime(45);
        kheer.setServingCount(6);
        kheer.setCategories(List.of(dessert));
        kheer.setCreatedAt(new Date());
        kheer.setUpdatedAt(new Date());
        kheer.setRating(4.6);
        kheer.setIngredients(List.of(
                new Ingredient("milk", "4", "cups", kheer),
                new Ingredient("basmati rice", "0.25", "cup", kheer),
                new Ingredient("sugar", "0.5", "cup", kheer),
                new Ingredient("cardamom", "4", null, kheer),
                new Ingredient("saffron", "1", "pinch", kheer),
                new Ingredient("almonds", "10", null, kheer),
                new Ingredient("pistachios", "10", null, kheer)
        ));
        kheer.setImages(List.of());

        // 25. Haleem
        Recipe haleem = new Recipe();
        haleem.setAppUser(zara);
        haleem.setTitle("Haleem");
        haleem.setDescription("Slow-cooked stew of wheat, barley, lentils, and meat, mashed to perfection.");
        haleem.setInstructions(List.of(
                "Soak wheat and barley overnight.",
                "Cook with lentils and meat until very soft.",
                "Mash everything together until smooth.",
                "Fry onions, ginger, and spices in ghee.",
                "Mix into the haleem and simmer.",
                "Garnish with fried onions, ginger, lemon, and coriander."
        ));
        haleem.setPrepTime(30);
        haleem.setCookTime(240);
        haleem.setServingCount(8);
        haleem.setCategories(List.of(mainCourse, soup));
        haleem.setCreatedAt(new Date());
        haleem.setUpdatedAt(new Date());
        haleem.setRating(4.8);
        haleem.setIngredients(List.of(
                new Ingredient("wheat", "0.5", "cup", haleem),
                new Ingredient("barley", "0.25", "cup", haleem),
                new Ingredient("lentils", "0.5", "cup", haleem),
                new Ingredient("beef", "500", "grams", haleem),
                new Ingredient("onions", "3", null, haleem),
                new Ingredient("ginger-garlic paste", "2", "tbsp", haleem),
                new Ingredient("haleem masala", "2", "tbsp", haleem),
                new Ingredient("ghee", "0.5", "cup", haleem)
        ));
        haleem.setImages(List.of());

        // 26. Aloo Keema
        Recipe alooKeema = new Recipe();
        alooKeema.setAppUser(zara);
        alooKeema.setTitle("Aloo Keema");
        alooKeema.setDescription("Spiced minced meat cooked with potatoes and peas.");
        alooKeema.setInstructions(List.of(
                "Brown mince in oil.",
                "Add onions, tomatoes, and spices.",
                "Add diced potatoes and peas.",
                "Cook until potatoes are tender.",
                "Garnish with green chilies and coriander.",
                "Serve with roti or rice."
        ));
        alooKeema.setPrepTime(15);
        alooKeema.setCookTime(35);
        alooKeema.setServingCount(4);
        alooKeema.setCategories(List.of(mainCourse));
        alooKeema.setCreatedAt(new Date());
        alooKeema.setUpdatedAt(new Date());
        alooKeema.setRating(4.5);
        alooKeema.setIngredients(List.of(
                new Ingredient("beef mince", "500", "grams", alooKeema),
                new Ingredient("potatoes", "2", null, alooKeema),
                new Ingredient("peas", "0.5", "cup", alooKeema),
                new Ingredient("onions", "2", null, alooKeema),
                new Ingredient("tomatoes", "2", null, alooKeema),
                new Ingredient("ginger-garlic paste", "1", "tbsp", alooKeema)
        ));
        alooKeema.setImages(List.of());

        recipeRepository.saveAll(List.of(alooParatha, chickenTikka, kheer, haleem, alooKeema));

        // Sixth user
        AppUser ali = new AppUser("ali@gmail.com", "Ali", passwordEncoder.encode("mypassword"));
        appUserRepository.save(ali);

        // 27. Malai Boti
        Recipe malaiBoti = new Recipe();
        malaiBoti.setAppUser(ali);
        malaiBoti.setTitle("Malai Boti");
        malaiBoti.setDescription("Creamy chicken chunks marinated in cream and mild spices, grilled to perfection.");
        malaiBoti.setInstructions(List.of(
                "Marinate chicken with cream, yogurt, cheese, and mild spices.",
                "Let it sit for 2-3 hours.",
                "Skewer and grill until golden.",
                "Serve with naan and raita."
        ));
        malaiBoti.setPrepTime(150);
        malaiBoti.setCookTime(20);
        malaiBoti.setServingCount(4);
        malaiBoti.setCategories(List.of(mainCourse, appetizer));
        malaiBoti.setCreatedAt(new Date());
        malaiBoti.setUpdatedAt(new Date());
        malaiBoti.setRating(4.8);
        malaiBoti.setIngredients(List.of(
                new Ingredient("chicken breast", "500", "grams", malaiBoti),
                new Ingredient("cream", "0.5", "cup", malaiBoti),
                new Ingredient("yogurt", "0.5", "cup", malaiBoti),
                new Ingredient("cheese", "2", "tbsp", malaiBoti),
                new Ingredient("white pepper", "0.5", "tsp", malaiBoti)
        ));
        malaiBoti.setImages(List.of());

        // 28. Pani Puri
        Recipe paniPuri = new Recipe();
        paniPuri.setAppUser(ali);
        paniPuri.setTitle("Pani Puri");
        paniPuri.setDescription("Crispy hollow puris filled with spicy tangy water and chickpeas.");
        paniPuri.setInstructions(List.of(
                "Prepare pani by blending mint, coriander, green chilies, and tamarind.",
                "Boil and mash chickpeas with spices.",
                "Make a hole in each puri.",
                "Fill with chickpea mixture and potato.",
                "Pour pani and serve immediately."
        ));
        paniPuri.setPrepTime(20);
        paniPuri.setCookTime(10);
        paniPuri.setServingCount(4);
        paniPuri.setCategories(List.of(snack, appetizer));
        paniPuri.setCreatedAt(new Date());
        paniPuri.setUpdatedAt(new Date());
        paniPuri.setRating(4.7);
        paniPuri.setIngredients(List.of(
                new Ingredient("puris", "20", null, paniPuri),
                new Ingredient("chickpeas", "0.5", "cup", paniPuri),
                new Ingredient("potatoes", "2", null, paniPuri),
                new Ingredient("mint", "1", "handful", paniPuri),
                new Ingredient("tamarind", "2", "tbsp", paniPuri),
                new Ingredient("green chilies", "3", null, paniPuri)
        ));
        paniPuri.setImages(List.of());

        // 29. Fruit Chaat
        Recipe fruitChaat = new Recipe();
        fruitChaat.setAppUser(ali);
        fruitChaat.setTitle("Fruit Chaat");
        fruitChaat.setDescription("Refreshing fruit salad with a Pakistani twist of chaat masala and lemon.");
        fruitChaat.setInstructions(List.of(
                "Chop assorted fruits into bite-sized pieces.",
                "Mix in a bowl.",
                "Sprinkle chaat masala, salt, and black pepper.",
                "Squeeze lemon juice and toss well.",
                "Serve chilled."
        ));
        fruitChaat.setPrepTime(15);
        fruitChaat.setCookTime(0);
        fruitChaat.setServingCount(4);
        fruitChaat.setCategories(List.of(salad, dessert, snack));
        fruitChaat.setCreatedAt(new Date());
        fruitChaat.setUpdatedAt(new Date());
        fruitChaat.setRating(4.2);
        fruitChaat.setIngredients(List.of(
                new Ingredient("apple", "1", null, fruitChaat),
                new Ingredient("banana", "2", null, fruitChaat),
                new Ingredient("grapes", "1", "cup", fruitChaat),
                new Ingredient("orange", "1", null, fruitChaat),
                new Ingredient("chaat masala", "1", "tsp", fruitChaat),
                new Ingredient("lemon", "1", null, fruitChaat)
        ));
        fruitChaat.setImages(List.of());

        // 30. Qeema Naan
        Recipe qeemaNaan = new Recipe();
        qeemaNaan.setAppUser(ali);
        qeemaNaan.setTitle("Qeema Naan");
        qeemaNaan.setDescription("Stuffed naan bread filled with spiced minced meat.");
        qeemaNaan.setInstructions(List.of(
                "Cook mince with onions, tomatoes, and spices until dry.",
                "Make naan dough and let it rest.",
                "Roll dough, stuff with keema.",
                "Seal and roll flat.",
                "Cook on tawa or tandoor until puffed and charred.",
                "Brush with butter and serve."
        ));
        qeemaNaan.setPrepTime(40);
        qeemaNaan.setCookTime(25);
        qeemaNaan.setServingCount(6);
        qeemaNaan.setCategories(List.of(mainCourse, sideDish));
        qeemaNaan.setCreatedAt(new Date());
        qeemaNaan.setUpdatedAt(new Date());
        qeemaNaan.setRating(4.9);
        qeemaNaan.setIngredients(List.of(
                new Ingredient("flour", "3", "cups", qeemaNaan),
                new Ingredient("beef mince", "300", "grams", qeemaNaan),
                new Ingredient("onion", "1", null, qeemaNaan),
                new Ingredient("tomato", "1", null, qeemaNaan),
                new Ingredient("yogurt", "0.5", "cup", qeemaNaan),
                new Ingredient("butter", "2", "tbsp", qeemaNaan)
        ));
        qeemaNaan.setImages(List.of());

        // 31. Rooh Afza Milkshake
        Recipe roohAfza = new Recipe();
        roohAfza.setAppUser(ali);
        roohAfza.setTitle("Rooh Afza Milkshake");
        roohAfza.setDescription("Sweet rose-flavored milk drink, perfect for summer.");
        roohAfza.setInstructions(List.of(
                "Blend milk, Rooh Afza syrup, and ice cream.",
                "Add ice cubes and blend until frothy.",
                "Pour into glasses.",
                "Serve chilled with a cherry on top."
        ));
        roohAfza.setPrepTime(5);
        roohAfza.setCookTime(0);
        roohAfza.setServingCount(2);
        roohAfza.setCategories(List.of(beverage, dessert));
        roohAfza.setCreatedAt(new Date());
        roohAfza.setUpdatedAt(new Date());
        roohAfza.setRating(4.5);
        roohAfza.setIngredients(List.of(
                new Ingredient("milk", "2", "cups", roohAfza),
                new Ingredient("Rooh Afza syrup", "4", "tbsp", roohAfza),
                new Ingredient("ice cream", "2", "scoops", roohAfza),
                new Ingredient("ice cubes", "6", null, roohAfza)
        ));
        roohAfza.setImages(List.of());

        // 32. Gol Gappay (another name for Pani Puri)
        Recipe beefBiryani = new Recipe();
        beefBiryani.setAppUser(ali);
        beefBiryani.setTitle("Beef Biryani");
        beefBiryani.setDescription("Aromatic beef and rice layered dish with rich spices and saffron.");
        beefBiryani.setInstructions(List.of(
                "Marinate beef with yogurt and spices.",
                "Parboil rice with whole spices.",
                "Layer beef and rice in a pot.",
                "Top with fried onions and saffron milk.",
                "Cook on dum for 30 minutes.",
                "Serve with raita."
        ));
        beefBiryani.setPrepTime(50);
        beefBiryani.setCookTime(60);
        beefBiryani.setServingCount(6);
        beefBiryani.setCategories(List.of(mainCourse));
        beefBiryani.setCreatedAt(new Date());
        beefBiryani.setUpdatedAt(new Date());
        beefBiryani.setRating(4.8);
        beefBiryani.setIngredients(List.of(
                new Ingredient("beef", "1", "kg", beefBiryani),
                new Ingredient("basmati rice", "3", "cups", beefBiryani),
                new Ingredient("yogurt", "1", "cup", beefBiryani),
                new Ingredient("biryani masala", "3", "tbsp", beefBiryani),
                new Ingredient("onions", "3", null, beefBiryani),
                new Ingredient("saffron", "1", "pinch", beefBiryani)
        ));
        beefBiryani.setImages(List.of());

        recipeRepository.saveAll(List.of(malaiBoti, paniPuri, fruitChaat, qeemaNaan, roohAfza, beefBiryani));

        // Seventh user
        AppUser sara = new AppUser("sara@gmail.com", "Sara", passwordEncoder.encode("mypassword"));
        appUserRepository.save(sara);

        // 33. Chicken Korma
        Recipe chickenKorma = new Recipe();
        chickenKorma.setAppUser(sara);
        chickenKorma.setTitle("Chicken Korma");
        chickenKorma.setDescription("Creamy and mildly spiced chicken curry with yogurt and nuts.");
        chickenKorma.setInstructions(List.of(
                "Marinate chicken with yogurt and spices.",
                "Fry onions until golden, then grind into paste.",
                "Cook chicken with onion paste and spices.",
                "Add cream and ground nuts.",
                "Simmer until chicken is tender.",
                "Garnish with almonds and serve with naan."
        ));
        chickenKorma.setPrepTime(25);
        chickenKorma.setCookTime(40);
        chickenKorma.setServingCount(5);
        chickenKorma.setCategories(List.of(mainCourse));
        chickenKorma.setCreatedAt(new Date());
        chickenKorma.setUpdatedAt(new Date());
        chickenKorma.setRating(4.7);
        chickenKorma.setIngredients(List.of(
                new Ingredient("chicken", "750", "grams", chickenKorma),
                new Ingredient("yogurt", "1", "cup", chickenKorma),
                new Ingredient("cream", "0.5", "cup", chickenKorma),
                new Ingredient("onions", "3", null, chickenKorma),
                new Ingredient("almonds", "10", null, chickenKorma),
                new Ingredient("cashews", "10", null, chickenKorma)
        ));
        chickenKorma.setImages(List.of());

        // 34. Gajar Ka Halwa
        Recipe gajarHalwa = new Recipe();
        gajarHalwa.setAppUser(sara);
        gajarHalwa.setTitle("Gajar Ka Halwa");
        gajarHalwa.setDescription("Sweet carrot dessert cooked in milk, ghee, and topped with nuts.");
        gajarHalwa.setInstructions(List.of(
                "Grate carrots and cook in milk until soft.",
                "Add sugar and ghee.",
                "Cook until mixture thickens.",
                "Add cardamom powder.",
                "Garnish with almonds and pistachios.",
                "Serve warm."
        ));
        gajarHalwa.setPrepTime(15);
        gajarHalwa.setCookTime(50);
        gajarHalwa.setServingCount(6);
        gajarHalwa.setCategories(List.of(dessert));
        gajarHalwa.setCreatedAt(new Date());
        gajarHalwa.setUpdatedAt(new Date());
        gajarHalwa.setRating(4.8);
        gajarHalwa.setIngredients(List.of(
                new Ingredient("carrots", "1", "kg", gajarHalwa),
                new Ingredient("milk", "3", "cups", gajarHalwa),
                new Ingredient("sugar", "1", "cup", gajarHalwa),
                new Ingredient("ghee", "0.5", "cup", gajarHalwa),
                new Ingredient("cardamom", "4", null, gajarHalwa),
                new Ingredient("almonds", "10", null, gajarHalwa)
        ));
        gajarHalwa.setImages(List.of());

        // 35. Daal Chawal (comfort food)
        Recipe daalChawal = new Recipe();
        daalChawal.setAppUser(sara);
        daalChawal.setTitle("Daal Chawal");
        daalChawal.setDescription("Simple lentil curry served with steamed rice, a Pakistani comfort food staple.");
        daalChawal.setInstructions(List.of(
                "Boil lentils until soft.",
                "Fry onions, tomatoes, and spices.",
                "Mix with lentils and simmer.",
                "Cook rice separately.",
                "Serve daal over rice with a lemon wedge."
        ));
        daalChawal.setPrepTime(10);
        daalChawal.setCookTime(35);
        daalChawal.setServingCount(4);
        daalChawal.setCategories(List.of(mainCourse));
        daalChawal.setCreatedAt(new Date());
        daalChawal.setUpdatedAt(new Date());
        daalChawal.setRating(4.6);
        daalChawal.setIngredients(List.of(
                new Ingredient("yellow lentils", "1", "cup", daalChawal),
                new Ingredient("rice", "2", "cups", daalChawal),
                new Ingredient("onion", "1", null, daalChawal),
                new Ingredient("tomato", "2", null, daalChawal),
                new Ingredient("cumin seeds", "1", "tsp", daalChawal),
                new Ingredient("turmeric", "0.5", "tsp", daalChawal)
        ));
        daalChawal.setImages(List.of());

        // 36. Pakistani Mac and Cheese
        Recipe pakMacCheese = new Recipe();
        pakMacCheese.setAppUser(sara);
        pakMacCheese.setTitle("Pakistani Mac and Cheese");
        pakMacCheese.setDescription("Creamy mac and cheese with a spicy Pakistani twist of green chilies and garam masala.");
        pakMacCheese.setInstructions(List.of(
                "Boil macaroni until al dente.",
                "Make cheese sauce with butter, flour, milk, and cheese.",
                "Add green chilies, garam masala, and red chili flakes.",
                "Mix with macaroni.",
                "Bake until golden on top.",
                "Serve hot."
        ));
        pakMacCheese.setPrepTime(20);
        pakMacCheese.setCookTime(30);
        pakMacCheese.setServingCount(4);
        pakMacCheese.setCategories(List.of(mainCourse, sideDish));
        pakMacCheese.setCreatedAt(new Date());
        pakMacCheese.setUpdatedAt(new Date());
        pakMacCheese.setRating(4.4);
        pakMacCheese.setIngredients(List.of(
                new Ingredient("macaroni", "2", "cups", pakMacCheese),
                new Ingredient("cheddar cheese", "2", "cups", pakMacCheese),
                new Ingredient("milk", "2", "cups", pakMacCheese),
                new Ingredient("butter", "3", "tbsp", pakMacCheese),
                new Ingredient("green chilies", "2", null, pakMacCheese),
                new Ingredient("garam masala", "0.5", "tsp", pakMacCheese)
        ));
        pakMacCheese.setImages(List.of());

        recipeRepository.saveAll(List.of(chickenKorma, gajarHalwa, daalChawal, pakMacCheese));
    }
}
