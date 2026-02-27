using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RecipeExchange.Api.Models;

namespace RecipeExchange.Api.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db, ILogger logger)
    {
        // Check if seed data already exists
        if (await db.Users.AnyAsync(u => u.Email == "alice@example.com"))
        {
            logger.LogInformation("Seed data already exists — skipping.");
            return;
        }

        logger.LogInformation("Seeding database...");

        var hasher = new PasswordHasher<User>();

        // --- Users ---
        var alice = new User
        {
            Username = "alice_cooks",
            Email = "alice@example.com",
            Bio = "Home chef who loves Italian and Mexican cuisine.",
            EmailConfirmed = true,
        };
        alice.PasswordHash = hasher.HashPassword(alice, "Password123!");

        var bob = new User
        {
            Username = "chef_bob",
            Email = "bob@example.com",
            Bio = "Professional pastry chef with 10 years of experience.",
            EmailConfirmed = true,
        };
        bob.PasswordHash = hasher.HashPassword(bob, "Password123!");

        var carol = new User
        {
            Username = "carol_bakes",
            Email = "carol@example.com",
            Bio = "Weekend baker and smoothie enthusiast.",
            EmailConfirmed = true,
        };
        carol.PasswordHash = hasher.HashPassword(carol, "Password123!");

        db.Users.AddRange(alice, bob, carol);
        await db.SaveChangesAsync();

        // --- Recipes ---
        var recipes = new List<Recipe>
        {
            new()
            {
                Title = "Classic Margherita Pizza",
                Description = "A simple and delicious Margherita pizza with fresh mozzarella, basil, and a homemade tomato sauce on a crispy thin crust.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Dough",
                        Items = ["2 1/4 tsp active dry yeast", "1 cup warm water", "3 cups all-purpose flour", "1 tbsp olive oil", "1 tsp salt", "1 tsp sugar"]
                    },
                    new IngredientGroup
                    {
                        Name = "Topping",
                        Items = ["1/2 cup tomato sauce", "8 oz fresh mozzarella, sliced", "Fresh basil leaves", "2 tbsp olive oil", "Salt and pepper to taste"]
                    }
                ],
                Instructions =
                [
                    "Dissolve yeast in warm water with sugar and let sit for 10 minutes until foamy.",
                    "Mix flour and salt, then add yeast mixture and olive oil. Knead for 8 minutes.",
                    "Let dough rise in a covered bowl for 1 hour.",
                    "Preheat oven to 475°F (245°C) with a pizza stone or inverted baking sheet.",
                    "Stretch dough into a 12-inch circle on a floured surface.",
                    "Spread tomato sauce, add mozzarella slices, and drizzle with olive oil.",
                    "Bake for 10-12 minutes until crust is golden and cheese is bubbly.",
                    "Top with fresh basil, slice, and serve immediately."
                ],
                PrepTime = 90,
                CookTime = 12,
                Servings = 4,
                Difficulty = "medium",
                Category = "dinner",
                Tags = ["italian", "pizza", "vegetarian"],
                AuthorId = alice.Id,
            },
            new()
            {
                Title = "Fluffy Buttermilk Pancakes",
                Description = "Light and fluffy buttermilk pancakes that are perfect for a weekend breakfast. Serve with maple syrup and fresh berries.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Dry Ingredients",
                        Items = ["1 1/2 cups all-purpose flour", "3 tbsp sugar", "1 tsp baking powder", "1/2 tsp baking soda", "1/4 tsp salt"]
                    },
                    new IngredientGroup
                    {
                        Name = "Wet Ingredients",
                        Items = ["1 1/4 cups buttermilk", "1 large egg", "3 tbsp melted butter", "1 tsp vanilla extract"]
                    }
                ],
                Instructions =
                [
                    "Whisk together all dry ingredients in a large bowl.",
                    "In a separate bowl, whisk buttermilk, egg, melted butter, and vanilla.",
                    "Pour wet ingredients into dry and stir until just combined (lumps are okay).",
                    "Heat a griddle or non-stick pan over medium heat and lightly grease.",
                    "Pour 1/4 cup batter per pancake and cook until bubbles form on surface.",
                    "Flip and cook for another 1-2 minutes until golden brown.",
                    "Serve with maple syrup, butter, and fresh berries."
                ],
                PrepTime = 10,
                CookTime = 15,
                Servings = 4,
                Difficulty = "easy",
                Category = "breakfast",
                Tags = ["pancakes", "breakfast", "vegetarian"],
                AuthorId = alice.Id,
            },
            new()
            {
                Title = "Chicken Tikka Masala",
                Description = "Rich and creamy chicken tikka masala with tender marinated chicken in a spiced tomato-based sauce. Restaurant quality at home.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Marinade",
                        Items = ["1.5 lbs chicken breast, cubed", "1 cup yogurt", "2 tbsp lemon juice", "2 tsp cumin", "2 tsp paprika", "1 tsp turmeric", "1 tsp salt"]
                    },
                    new IngredientGroup
                    {
                        Name = "Sauce",
                        Items = ["2 tbsp butter", "1 large onion, diced", "4 cloves garlic, minced", "1 tbsp ginger, grated", "1 can (14 oz) crushed tomatoes", "1 cup heavy cream", "2 tsp garam masala", "1 tsp cumin", "1 tsp paprika", "Salt to taste", "Fresh cilantro for garnish"]
                    }
                ],
                Instructions =
                [
                    "Combine chicken with all marinade ingredients. Refrigerate for at least 1 hour (overnight is best).",
                    "Thread chicken onto skewers and broil for 4-5 minutes per side until charred. Set aside.",
                    "In a large pan, melt butter and sauté onion until soft, about 5 minutes.",
                    "Add garlic and ginger, cook for 1 minute until fragrant.",
                    "Add crushed tomatoes, garam masala, cumin, and paprika. Simmer for 15 minutes.",
                    "Stir in heavy cream and add the cooked chicken. Simmer for 10 more minutes.",
                    "Season with salt to taste and garnish with fresh cilantro.",
                    "Serve over basmati rice or with warm naan bread."
                ],
                PrepTime = 75,
                CookTime = 35,
                Servings = 4,
                Difficulty = "medium",
                Category = "dinner",
                Tags = ["indian", "chicken", "curry", "spicy"],
                AuthorId = bob.Id,
            },
            new()
            {
                Title = "Classic Chocolate Chip Cookies",
                Description = "Perfectly chewy chocolate chip cookies with crispy edges and a soft center. A timeless favorite that never disappoints.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Ingredients",
                        Items = ["2 1/4 cups all-purpose flour", "1 tsp baking soda", "1 tsp salt", "1 cup butter, softened", "3/4 cup sugar", "3/4 cup packed brown sugar", "2 large eggs", "2 tsp vanilla extract", "2 cups semi-sweet chocolate chips"]
                    }
                ],
                Instructions =
                [
                    "Preheat oven to 375°F (190°C).",
                    "Whisk flour, baking soda, and salt together in a bowl.",
                    "In a large bowl, cream butter and both sugars until light and fluffy.",
                    "Beat in eggs one at a time, then add vanilla extract.",
                    "Gradually mix in the flour mixture until just combined.",
                    "Fold in chocolate chips.",
                    "Drop rounded tablespoons of dough onto ungreased baking sheets.",
                    "Bake for 9-11 minutes until edges are golden but centers look slightly underdone.",
                    "Cool on baking sheet for 5 minutes before transferring to a wire rack."
                ],
                PrepTime = 15,
                CookTime = 11,
                Servings = 36,
                Difficulty = "easy",
                Category = "dessert",
                Tags = ["cookies", "chocolate", "baking", "vegetarian"],
                AuthorId = bob.Id,
            },
            new()
            {
                Title = "Fresh Garden Salad with Lemon Vinaigrette",
                Description = "A crisp, refreshing garden salad loaded with seasonal vegetables and tossed in a bright lemon vinaigrette.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Salad",
                        Items = ["6 cups mixed greens", "1 cup cherry tomatoes, halved", "1 cucumber, sliced", "1/2 red onion, thinly sliced", "1 avocado, diced", "1/4 cup sunflower seeds"]
                    },
                    new IngredientGroup
                    {
                        Name = "Lemon Vinaigrette",
                        Items = ["3 tbsp olive oil", "2 tbsp fresh lemon juice", "1 tsp Dijon mustard", "1 tsp honey", "Salt and pepper to taste"]
                    }
                ],
                Instructions =
                [
                    "Wash and dry all salad greens and vegetables.",
                    "Combine greens, tomatoes, cucumber, red onion, and avocado in a large bowl.",
                    "Whisk together olive oil, lemon juice, Dijon mustard, and honey.",
                    "Season vinaigrette with salt and pepper.",
                    "Drizzle dressing over salad and toss gently.",
                    "Top with sunflower seeds and serve immediately."
                ],
                PrepTime = 15,
                CookTime = 0,
                Servings = 4,
                Difficulty = "easy",
                Category = "lunch",
                Tags = ["salad", "healthy", "vegan", "quick"],
                AuthorId = carol.Id,
            },
            new()
            {
                Title = "Beef Tacos with Pico de Gallo",
                Description = "Seasoned ground beef tacos topped with fresh pico de gallo, sour cream, and shredded cheese in warm corn tortillas.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Taco Meat",
                        Items = ["1 lb ground beef", "1 tbsp chili powder", "1 tsp cumin", "1/2 tsp garlic powder", "1/2 tsp onion powder", "1/4 tsp cayenne pepper", "Salt and pepper to taste", "1/4 cup water"]
                    },
                    new IngredientGroup
                    {
                        Name = "Pico de Gallo",
                        Items = ["3 Roma tomatoes, diced", "1/2 white onion, finely diced", "1 jalapeño, seeded and minced", "1/4 cup fresh cilantro, chopped", "2 tbsp lime juice", "Salt to taste"]
                    },
                    new IngredientGroup
                    {
                        Name = "To Serve",
                        Items = ["8 small corn tortillas", "1 cup shredded cheddar cheese", "Sour cream", "Shredded lettuce"]
                    }
                ],
                Instructions =
                [
                    "Mix all pico de gallo ingredients together and refrigerate while preparing tacos.",
                    "Brown ground beef in a skillet over medium-high heat, breaking it up as it cooks.",
                    "Drain excess fat, then add all seasonings and water.",
                    "Simmer for 5 minutes until the liquid is mostly absorbed.",
                    "Warm tortillas in a dry skillet or directly over a gas flame.",
                    "Assemble tacos with meat, pico de gallo, cheese, lettuce, and sour cream.",
                    "Serve immediately with lime wedges on the side."
                ],
                PrepTime = 20,
                CookTime = 15,
                Servings = 4,
                Difficulty = "easy",
                Category = "dinner",
                Tags = ["mexican", "tacos", "beef", "quick"],
                AuthorId = alice.Id,
            },
            new()
            {
                Title = "Mango Smoothie Bowl",
                Description = "A thick and creamy mango smoothie bowl topped with fresh fruit, granola, and coconut flakes for a nutritious breakfast.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Smoothie Base",
                        Items = ["2 cups frozen mango chunks", "1 frozen banana", "1/2 cup Greek yogurt", "1/4 cup orange juice"]
                    },
                    new IngredientGroup
                    {
                        Name = "Toppings",
                        Items = ["1/4 cup granola", "Fresh strawberries, sliced", "1 tbsp coconut flakes", "1 tbsp chia seeds", "Drizzle of honey"]
                    }
                ],
                Instructions =
                [
                    "Blend frozen mango, banana, Greek yogurt, and orange juice until thick and smooth.",
                    "Pour into a bowl (mixture should be thicker than a regular smoothie).",
                    "Arrange toppings in rows across the top of the bowl.",
                    "Drizzle with honey and serve immediately."
                ],
                PrepTime = 10,
                CookTime = 0,
                Servings = 1,
                Difficulty = "easy",
                Category = "breakfast",
                Tags = ["smoothie", "healthy", "fruit", "vegetarian"],
                AuthorId = carol.Id,
            },
            new()
            {
                Title = "Garlic Butter Shrimp Pasta",
                Description = "Quick and luxurious garlic butter shrimp tossed with linguine, cherry tomatoes, and a splash of white wine.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Ingredients",
                        Items = ["12 oz linguine", "1 lb large shrimp, peeled and deveined", "4 tbsp butter", "6 cloves garlic, minced", "1 cup cherry tomatoes, halved", "1/2 cup dry white wine", "1/4 cup fresh parsley, chopped", "1/4 tsp red pepper flakes", "Salt and pepper to taste", "Parmesan cheese for serving"]
                    }
                ],
                Instructions =
                [
                    "Cook linguine according to package directions. Reserve 1/2 cup pasta water before draining.",
                    "Season shrimp with salt, pepper, and a pinch of red pepper flakes.",
                    "Melt 2 tbsp butter in a large skillet over medium-high heat. Cook shrimp 2 minutes per side. Remove and set aside.",
                    "Add remaining butter and garlic to the skillet. Cook for 30 seconds until fragrant.",
                    "Add cherry tomatoes and white wine. Simmer for 3 minutes.",
                    "Add cooked pasta, shrimp, and parsley. Toss, adding pasta water as needed for sauce consistency.",
                    "Serve with freshly grated Parmesan cheese."
                ],
                PrepTime = 10,
                CookTime = 20,
                Servings = 4,
                Difficulty = "easy",
                Category = "dinner",
                Tags = ["pasta", "seafood", "quick", "italian"],
                AuthorId = bob.Id,
            },
            new()
            {
                Title = "Crispy Fried Chicken Sandwich",
                Description = "A crunchy, juicy fried chicken sandwich with pickles, coleslaw, and spicy mayo on a toasted brioche bun.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Chicken",
                        Items = ["2 boneless chicken thighs", "1 cup buttermilk", "1 cup all-purpose flour", "1 tsp paprika", "1 tsp garlic powder", "1/2 tsp cayenne pepper", "Salt and pepper", "Oil for frying"]
                    },
                    new IngredientGroup
                    {
                        Name = "Assembly",
                        Items = ["2 brioche buns, toasted", "Dill pickle slices", "1/2 cup coleslaw", "2 tbsp mayonnaise", "1 tsp hot sauce"]
                    }
                ],
                Instructions =
                [
                    "Soak chicken thighs in buttermilk for at least 30 minutes (overnight is ideal).",
                    "Mix flour, paprika, garlic powder, cayenne, salt, and pepper in a shallow dish.",
                    "Remove chicken from buttermilk, letting excess drip off, and dredge in flour mixture.",
                    "Heat 1 inch of oil in a heavy skillet to 350°F (175°C).",
                    "Fry chicken for 4-5 minutes per side until golden brown and cooked through (165°F internal).",
                    "Drain on a wire rack and season with a pinch of salt immediately.",
                    "Mix mayonnaise with hot sauce for spicy mayo.",
                    "Assemble sandwiches: bun, spicy mayo, chicken, pickles, coleslaw, top bun."
                ],
                PrepTime = 40,
                CookTime = 10,
                Servings = 2,
                Difficulty = "medium",
                Category = "lunch",
                Tags = ["chicken", "sandwich", "fried", "comfort-food"],
                AuthorId = alice.Id,
            },
            new()
            {
                Title = "Tiramisu",
                Description = "Classic Italian tiramisu with layers of coffee-soaked ladyfingers and rich mascarpone cream dusted with cocoa powder.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Ingredients",
                        Items = ["6 egg yolks", "3/4 cup sugar", "16 oz mascarpone cheese", "2 cups heavy cream", "2 cups strong espresso, cooled", "2 tbsp coffee liqueur (optional)", "1 package ladyfinger cookies", "Unsweetened cocoa powder for dusting"]
                    }
                ],
                Instructions =
                [
                    "Whisk egg yolks and sugar until thick and pale yellow, about 4 minutes.",
                    "Add mascarpone cheese and mix until smooth and combined.",
                    "In a separate bowl, whip heavy cream to stiff peaks.",
                    "Gently fold whipped cream into the mascarpone mixture.",
                    "Combine espresso and coffee liqueur in a shallow dish.",
                    "Quickly dip each ladyfinger into the espresso (don't soak — just a quick dip).",
                    "Arrange a layer of dipped ladyfingers in the bottom of a 9x13 dish.",
                    "Spread half of the mascarpone cream over the ladyfingers.",
                    "Repeat with another layer of ladyfingers and remaining cream.",
                    "Cover and refrigerate for at least 4 hours (overnight is best).",
                    "Dust generously with cocoa powder before serving."
                ],
                PrepTime = 30,
                CookTime = 0,
                Servings = 8,
                Difficulty = "hard",
                Category = "dessert",
                Tags = ["italian", "dessert", "coffee", "no-bake"],
                AuthorId = bob.Id,
            },
            new()
            {
                Title = "Spicy Black Bean Soup",
                Description = "A hearty and warming black bean soup with smoky chipotle peppers, cumin, and a squeeze of fresh lime.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Ingredients",
                        Items = ["2 cans (15 oz each) black beans, drained and rinsed", "1 tbsp olive oil", "1 onion, diced", "3 cloves garlic, minced", "1 can (14 oz) diced tomatoes", "2 cups vegetable broth", "1 chipotle pepper in adobo, minced", "1 tsp cumin", "1/2 tsp smoked paprika", "Salt and pepper to taste", "Sour cream, cilantro, and lime for serving"]
                    }
                ],
                Instructions =
                [
                    "Heat olive oil in a large pot over medium heat. Sauté onion until softened, about 5 minutes.",
                    "Add garlic, cumin, and smoked paprika. Cook for 1 minute.",
                    "Add black beans, diced tomatoes, vegetable broth, and chipotle pepper.",
                    "Bring to a boil, then reduce heat and simmer for 20 minutes.",
                    "Use an immersion blender to partially blend (leave some beans whole for texture).",
                    "Season with salt and pepper to taste.",
                    "Serve topped with sour cream, fresh cilantro, and a squeeze of lime."
                ],
                PrepTime = 10,
                CookTime = 25,
                Servings = 6,
                Difficulty = "easy",
                Category = "dinner",
                Tags = ["soup", "vegan", "healthy", "spicy"],
                AuthorId = carol.Id,
            },
            new()
            {
                Title = "Banana Bread",
                Description = "Moist and tender banana bread with a golden crust. The perfect way to use up overripe bananas.",
                Ingredients =
                [
                    new IngredientGroup
                    {
                        Name = "Ingredients",
                        Items = ["3 ripe bananas, mashed", "1/3 cup melted butter", "3/4 cup sugar", "1 large egg", "1 tsp vanilla extract", "1 tsp baking soda", "Pinch of salt", "1 1/2 cups all-purpose flour", "1/2 cup walnuts, chopped (optional)"]
                    }
                ],
                Instructions =
                [
                    "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.",
                    "Mash bananas in a large bowl with a fork.",
                    "Mix in melted butter, sugar, egg, and vanilla extract.",
                    "Sprinkle in baking soda and salt, then stir to combine.",
                    "Add flour and mix until just incorporated. Fold in walnuts if using.",
                    "Pour batter into the prepared loaf pan.",
                    "Bake for 55-65 minutes until a toothpick inserted in the center comes out clean.",
                    "Cool in pan for 10 minutes, then turn out onto a wire rack."
                ],
                PrepTime = 10,
                CookTime = 60,
                Servings = 8,
                Difficulty = "easy",
                Category = "snack",
                Tags = ["baking", "banana", "bread", "vegetarian"],
                AuthorId = alice.Id,
            },
        };

        db.Recipes.AddRange(recipes);
        await db.SaveChangesAsync();

        // --- Votes ---
        var votes = new List<Vote>
        {
            new() { UserId = bob.Id, RecipeId = recipes[0].Id, VoteType = "upvote" },
            new() { UserId = carol.Id, RecipeId = recipes[0].Id, VoteType = "upvote" },
            new() { UserId = alice.Id, RecipeId = recipes[2].Id, VoteType = "upvote" },
            new() { UserId = carol.Id, RecipeId = recipes[2].Id, VoteType = "upvote" },
            new() { UserId = alice.Id, RecipeId = recipes[3].Id, VoteType = "upvote" },
            new() { UserId = carol.Id, RecipeId = recipes[3].Id, VoteType = "upvote" },
            new() { UserId = alice.Id, RecipeId = recipes[4].Id, VoteType = "upvote" },
            new() { UserId = bob.Id, RecipeId = recipes[4].Id, VoteType = "upvote" },
            new() { UserId = alice.Id, RecipeId = recipes[7].Id, VoteType = "upvote" },
            new() { UserId = carol.Id, RecipeId = recipes[7].Id, VoteType = "upvote" },
            new() { UserId = bob.Id, RecipeId = recipes[1].Id, VoteType = "upvote" },
            new() { UserId = alice.Id, RecipeId = recipes[9].Id, VoteType = "upvote" },
            new() { UserId = carol.Id, RecipeId = recipes[9].Id, VoteType = "upvote" },
            new() { UserId = bob.Id, RecipeId = recipes[5].Id, VoteType = "downvote" },
            new() { UserId = alice.Id, RecipeId = recipes[10].Id, VoteType = "upvote" },
        };

        db.Votes.AddRange(votes);
        await db.SaveChangesAsync();

        // Update VoteScore on recipes
        foreach (var recipe in recipes)
        {
            var upvotes = votes.Count(v => v.RecipeId == recipe.Id && v.VoteType == "upvote");
            var downvotes = votes.Count(v => v.RecipeId == recipe.Id && v.VoteType == "downvote");
            recipe.VoteScore = upvotes - downvotes;
        }
        await db.SaveChangesAsync();

        // --- Saved Recipes ---
        var savedRecipes = new List<SavedRecipe>
        {
            new() { UserId = alice.Id, RecipeId = recipes[2].Id },
            new() { UserId = alice.Id, RecipeId = recipes[3].Id },
            new() { UserId = alice.Id, RecipeId = recipes[9].Id },
            new() { UserId = bob.Id, RecipeId = recipes[0].Id },
            new() { UserId = bob.Id, RecipeId = recipes[4].Id },
            new() { UserId = carol.Id, RecipeId = recipes[0].Id },
            new() { UserId = carol.Id, RecipeId = recipes[7].Id },
            new() { UserId = carol.Id, RecipeId = recipes[8].Id },
        };

        db.SavedRecipes.AddRange(savedRecipes);
        await db.SaveChangesAsync();

        logger.LogInformation(
            "Seeded {UserCount} users, {RecipeCount} recipes, {VoteCount} votes, {SavedCount} saved recipes.",
            3, recipes.Count, votes.Count, savedRecipes.Count);
    }
}
