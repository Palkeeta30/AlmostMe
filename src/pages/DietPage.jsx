import React, { useState, useEffect } from "react";
import { dietAPI } from "../utils/api";
import "./DietPage.css";

const DietPage = () => {
  const [selectedMeals, setSelectedMeals] = useState({
    morning_drink: [],
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    detox: [],
  });

  const [dietPreference, setDietPreference] = useState("veg");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await dietAPI.getPlan();
        if ((res.status === 200 || res.status === 201) && res.data && mounted) {
          // Assuming the API returns user profile info in diet plan response
          setUserProfile(res.data.userProfile || null);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const mealItems = [
    // Breakfast
    {
      id: 1,
      name: "Avocado Toast",
      calories: 250,
      protein: 8,
      carbs: 30,
      fat: 15,
      image: "🥑",
      category: "breakfast",
      diet: "vegan",
    },
    {
      id: 2,
      name: "Greek Yogurt Bowl",
      calories: 180,
      protein: 15,
      carbs: 20,
      fat: 5,
      image: "🥣",
      category: "breakfast",
      diet: "veg",
    },
    {
      id: 3,
      name: "Oatmeal with Berries",
      calories: 220,
      protein: 6,
      carbs: 45,
      fat: 3,
      image: "🥣",
      category: "breakfast",
      diet: "vegan",
    },
    {
      id: 13,
      name: "Chia Pudding",
      calories: 210,
      protein: 6,
      carbs: 25,
      fat: 9,
      image: "🍨",
      category: "breakfast",
      diet: "vegan",
    },
    {
      id: 14,
      name: "Smoothie Bowl",
      calories: 240,
      protein: 7,
      carbs: 42,
      fat: 6,
      image: "🥝",
      category: "breakfast",
      diet: "vegan",
    },
    {
      id: 15,
      name: "Tofu Scramble",
      calories: 230,
      protein: 16,
      carbs: 8,
      fat: 14,
      image: "🍳",
      category: "breakfast",
      diet: "vegan",
    },
    {
      id: 16,
      name: "Paneer Bhurji Toast",
      calories: 280,
      protein: 18,
      carbs: 28,
      fat: 12,
      image: "🍞",
      category: "breakfast",
      diet: "veg",
    },
    {
      id: 17,
      name: "Cottage Cheese Pancakes",
      calories: 300,
      protein: 20,
      carbs: 35,
      fat: 8,
      image: "🥞",
      category: "breakfast",
      diet: "veg",
    },
    {
      id: 18,
      name: "PB Banana Toast",
      calories: 270,
      protein: 9,
      carbs: 32,
      fat: 12,
      image: "🍌",
      category: "breakfast",
      diet: "veg",
    },
    {
      id: 19,
      name: "Egg Omelette",
      calories: 260,
      protein: 18,
      carbs: 2,
      fat: 20,
      image: "🥚",
      category: "breakfast",
      diet: "non-veg",
    },
    {
      id: 20,
      name: "Smoked Salmon Bagel",
      calories: 380,
      protein: 22,
      carbs: 45,
      fat: 12,
      image: "🥯",
      category: "breakfast",
      diet: "non-veg",
    },
    {
      id: 21,
      name: "Turkey Egg Wrap",
      calories: 320,
      protein: 24,
      carbs: 28,
      fat: 12,
      image: "🌯",
      category: "breakfast",
      diet: "non-veg",
    },

    // Lunch
    {
      id: 4,
      name: "Quinoa Salad",
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      image: "🥗",
      category: "lunch",
      diet: "vegan",
    },
    {
      id: 6,
      name: "Buddha Bowl",
      calories: 350,
      protein: 15,
      carbs: 40,
      fat: 18,
      image: "🍲",
      category: "lunch",
      diet: "vegan",
    },
    {
      id: 22,
      name: "Tofu Stir-Fry",
      calories: 340,
      protein: 20,
      carbs: 30,
      fat: 14,
      image: "🍜",
      category: "lunch",
      diet: "vegan",
    },
    {
      id: 23,
      name: "Chickpea Salad Sandwich",
      calories: 310,
      protein: 14,
      carbs: 46,
      fat: 8,
      image: "🥪",
      category: "lunch",
      diet: "vegan",
    },
    {
      id: 24,
      name: "Lentil Power Bowl",
      calories: 360,
      protein: 18,
      carbs: 50,
      fat: 9,
      image: "🍚",
      category: "lunch",
      diet: "vegan",
    },
    {
      id: 25,
      name: "Paneer Tikka Wrap",
      calories: 420,
      protein: 22,
      carbs: 44,
      fat: 16,
      image: "🌯",
      category: "lunch",
      diet: "veg",
    },
    {
      id: 26,
      name: "Veggie Burrito",
      calories: 430,
      protein: 16,
      carbs: 56,
      fat: 12,
      image: "🌯",
      category: "lunch",
      diet: "veg",
    },
    {
      id: 27,
      name: "Pasta Primavera",
      calories: 390,
      protein: 14,
      carbs: 60,
      fat: 9,
      image: "🍝",
      category: "lunch",
      diet: "veg",
    },
    {
      id: 5,
      name: "Grilled Chicken Wrap",
      calories: 380,
      protein: 25,
      carbs: 35,
      fat: 15,
      image: "🌯",
      category: "lunch",
      diet: "non-veg",
    },
    {
      id: 28,
      name: "Turkey Avocado Sandwich",
      calories: 420,
      protein: 28,
      carbs: 36,
      fat: 16,
      image: "🥪",
      category: "lunch",
      diet: "non-veg",
    },
    {
      id: 29,
      name: "Tuna Salad Bowl",
      calories: 350,
      protein: 30,
      carbs: 22,
      fat: 14,
      image: "🥗",
      category: "lunch",
      diet: "non-veg",
    },
    {
      id: 30,
      name: "Chicken Caesar Salad",
      calories: 410,
      protein: 32,
      carbs: 20,
      fat: 22,
      image: "🥗",
      category: "lunch",
      diet: "non-veg",
    },

    // Dinner
    {
      id: 8,
      name: "Lentil Curry",
      calories: 300,
      protein: 18,
      carbs: 45,
      fat: 8,
      image: "🍛",
      category: "dinner",
      diet: "vegan",
    },
    {
      id: 9,
      name: "Grilled Vegetables",
      calories: 150,
      protein: 5,
      carbs: 25,
      fat: 5,
      image: "🥬",
      category: "dinner",
      diet: "vegan",
    },
    {
      id: 31,
      name: "Tofu Curry",
      calories: 320,
      protein: 20,
      carbs: 22,
      fat: 14,
      image: "🍛",
      category: "dinner",
      diet: "vegan",
    },
    {
      id: 32,
      name: "Veggie Stir-Fry Noodles",
      calories: 380,
      protein: 12,
      carbs: 60,
      fat: 10,
      image: "🍜",
      category: "dinner",
      diet: "vegan",
    },
    {
      id: 33,
      name: "Roasted Chickpea Bowl",
      calories: 340,
      protein: 16,
      carbs: 48,
      fat: 9,
      image: "🍲",
      category: "dinner",
      diet: "vegan",
    },
    {
      id: 34,
      name: "Paneer Butter Masala",
      calories: 450,
      protein: 22,
      carbs: 30,
      fat: 24,
      image: "🍲",
      category: "dinner",
      diet: "veg",
    },
    {
      id: 35,
      name: "Veg Lasagna",
      calories: 430,
      protein: 18,
      carbs: 50,
      fat: 16,
      image: "🍝",
      category: "dinner",
      diet: "veg",
    },
    {
      id: 36,
      name: "Palak Paneer",
      calories: 380,
      protein: 24,
      carbs: 20,
      fat: 18,
      image: "🥘",
      category: "dinner",
      diet: "veg",
    },
    {
      id: 7,
      name: "Baked Salmon",
      calories: 400,
      protein: 35,
      carbs: 5,
      fat: 25,
      image: "🐟",
      category: "dinner",
      diet: "non-veg",
    },
    {
      id: 37,
      name: "Grilled Chicken Breast",
      calories: 360,
      protein: 38,
      carbs: 0,
      fat: 16,
      image: "🍗",
      category: "dinner",
      diet: "non-veg",
    },
    {
      id: 38,
      name: "Beef Stir-Fry",
      calories: 420,
      protein: 32,
      carbs: 18,
      fat: 22,
      image: "🥩",
      category: "dinner",
      diet: "non-veg",
    },
    {
      id: 39,
      name: "Shrimp Garlic Sauté",
      calories: 330,
      protein: 28,
      carbs: 4,
      fat: 16,
      image: "🍤",
      category: "dinner",
      diet: "non-veg",
    },

    // Snacks
    {
      id: 10,
      name: "Mixed Nuts",
      calories: 160,
      protein: 6,
      carbs: 6,
      fat: 14,
      image: "🥜",
      category: "snack",
      diet: "vegan",
    },
    {
      id: 11,
      name: "Apple Slices",
      calories: 80,
      protein: 0,
      carbs: 22,
      fat: 0,
      image: "🍎",
      category: "snack",
      diet: "vegan",
    },
    {
      id: 12,
      name: "Protein Smoothie",
      calories: 200,
      protein: 20,
      carbs: 15,
      fat: 8,
      image: "🥤",
      category: "snack",
      diet: "veg",
    },
    {
      id: 40,
      name: "Hummus with Carrots",
      calories: 150,
      protein: 5,
      carbs: 16,
      fat: 8,
      image: "🥕",
      category: "snack",
      diet: "vegan",
    },
    {
      id: 41,
      name: "Rice Cakes & Almond Butter",
      calories: 190,
      protein: 5,
      carbs: 22,
      fat: 9,
      image: "🍘",
      category: "snack",
      diet: "vegan",
    },
    {
      id: 42,
      name: "Trail Mix",
      calories: 210,
      protein: 6,
      carbs: 20,
      fat: 12,
      image: "🥨",
      category: "snack",
      diet: "vegan",
    },
    {
      id: 43,
      name: "Cheese Sticks",
      calories: 90,
      protein: 6,
      carbs: 1,
      fat: 7,
      image: "🧀",
      category: "snack",
      diet: "veg",
    },
    {
      id: 44,
      name: "Yogurt Parfait",
      calories: 220,
      protein: 12,
      carbs: 28,
      fat: 6,
      image: "🍧",
      category: "snack",
      diet: "veg",
    },
    {
      id: 45,
      name: "Fruit & Cottage Cheese",
      calories: 180,
      protein: 14,
      carbs: 16,
      fat: 6,
      image: "🍓",
      category: "snack",
      diet: "veg",
    },
    {
      id: 46,
      name: "Beef Jerky",
      calories: 140,
      protein: 13,
      carbs: 3,
      fat: 8,
      image: "🥓",
      category: "snack",
      diet: "non-veg",
    },
    {
      id: 47,
      name: "Tuna Crackers",
      calories: 190,
      protein: 14,
      carbs: 20,
      fat: 6,
      image: "🐟",
      category: "snack",
      diet: "non-veg",
    },
    {
      id: 48,
      name: "Hard-Boiled Eggs",
      calories: 140,
      protein: 12,
      carbs: 2,
      fat: 9,
      image: "🥚",
      category: "snack",
      diet: "non-veg",
    },

    // Morning Drinks
    {
      id: 49,
      name: "Jeera Water",
      calories: 4,
      protein: 0,
      carbs: 1,
      fat: 0,
      image: "🧪",
      category: "morning_drink",
      diet: "vegan",
    },
    {
      id: 50,
      name: "Ginger Water",
      calories: 6,
      protein: 0,
      carbs: 2,
      fat: 0,
      image: "🫚",
      category: "morning_drink",
      diet: "vegan",
    },
    {
      id: 51,
      name: "Green Tea",
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0,
      image: "🍵",
      category: "morning_drink",
      diet: "vegan",
    },
    {
      id: 52,
      name: "Black Coffee",
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0,
      image: "☕",
      category: "morning_drink",
      diet: "vegan",
    },
    {
      id: 53,
      name: "Turmeric Milk",
      calories: 150,
      protein: 8,
      carbs: 14,
      fat: 7,
      image: "🥛",
      category: "morning_drink",
      diet: "veg",
    },
    {
      id: 54,
      name: "Cinnamon Water",
      calories: 5,
      protein: 0,
      carbs: 2,
      fat: 0,
      image: "🧂",
      category: "morning_drink",
      diet: "vegan",
    },

    // Detox Drinks
    {
      id: 55,
      name: "Cucumber Mint Detox Water",
      calories: 8,
      protein: 0,
      carbs: 2,
      fat: 0,
      image: "🥒",
      category: "detox",
      diet: "vegan",
    },
    {
      id: 56,
      name: "Apple Cider Vinegar Drink",
      calories: 12,
      protein: 0,
      carbs: 3,
      fat: 0,
      image: "🍎",
      category: "detox",
      diet: "vegan",
    },
    {
      id: 57,
      name: "Charcoal Lemonade",
      calories: 20,
      protein: 0,
      carbs: 5,
      fat: 0,
      image: "🧃",
      category: "detox",
      diet: "vegan",
    },
    {
      id: 58,
      name: "Aloe Vera Juice",
      calories: 15,
      protein: 0,
      carbs: 4,
      fat: 0,
      image: "🌿",
      category: "detox",
      diet: "vegan",
    },
    {
      id: 59,
      name: "Beetroot Detox Juice",
      calories: 70,
      protein: 2,
      carbs: 16,
      fat: 0,
      image: "🧃",
      category: "detox",
      diet: "vegan",
    },
    {
      id: 60,
      name: "Lemon-Ginger Detox Water",
      calories: 10,
      protein: 0,
      carbs: 3,
      fat: 0,
      image: "🍋",
      category: "detox",
      diet: "vegan",
    },
  ];

  const getFilteredMeals = (category) => {
    let items = mealItems.filter((i) => i.category === category);

    // Apply diet preference
    if (dietPreference === "veg") {
      items = items.filter((i) => i.diet === "veg" || i.diet === "vegan");
    } else if (dietPreference === "vegan") {
      items = items.filter((i) => i.diet === "vegan");
    } else if (dietPreference === "non-veg") {
      // For drink categories, include all drinks regardless of diet tag
      if (category === "morning_drink" || category === "detox") {
        // keep items as-is
      } else {
        items = items.filter((i) => i.diet === "non-veg");
      }
    }

    // Profile-based adjustments
    if (userProfile) {
      if (userProfile.is_pregnant) {
        items = items.filter((i) => !/salmon/i.test(i.name));
      }
      const goal = userProfile.goal;
      if (goal === "muscle_gain") {
        items = items.filter((i) => i.protein >= 12);
        items = items.slice().sort((a, b) => b.protein - a.protein);
      } else if (goal === "fat_loss" || goal === "weight_loss") {
        items = items.filter((i) => i.calories <= 350);
        items = items.slice().sort((a, b) => a.calories - b.calories);
      }
    }

    return items;
  };

  const addMealToPlanner = (meal) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [meal.category]: [...prev[meal.category], meal],
    }));
  };

  const removeMealFromPlanner = (mealId, category) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [category]: prev[category].filter((meal) => meal.id !== mealId),
    }));
  };

  const getTotalNutrition = () => {
    const allMeals = [
      ...selectedMeals.morning_drink,
      ...selectedMeals.breakfast,
      ...selectedMeals.lunch,
      ...selectedMeals.snack,
      ...selectedMeals.dinner,
      ...selectedMeals.detox,
    ];

    return allMeals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fat: total.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const saveMealPlan = async () => {
    try {
      const mealPlanData = {
        meals: selectedMeals,
        total_nutrition: getTotalNutrition(),
        diet_preference: dietPreference,
        created_at: new Date().toISOString(),
      };

      const response = await dietAPI.savePlan(mealPlanData);

      if (response.status === 200 || response.status === 201) {
        alert("Meal plan saved successfully!");
        // Optionally reset the selected meals or update UI
      } else {
        alert("Failed to save meal plan. Please try again.");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("An error occurred while saving your meal plan.");
    }
  };

  return (
    <div className="diet-page">
      {/* Hero Section */}
      <section className="diet-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Diet & <span className="gradient-text">Nutrition</span>
            </h1>
            <p>Optimize your nutrition with personalized meal plans</p>
          </div>

          {/* Animated Food Visuals */}
          <div className="food-animation">
            <div className="animated-plate">
              <div className="plate"></div>
              <div className="food-items">
                <div className="food-item apple">🍎</div>
                <div className="food-item carrot">🥕</div>
                <div className="food-item broccoli">🥦</div>
              </div>
            </div>

            <div className="animated-glass">
              <div className="glass">
                <div className="juice"></div>
              </div>
            </div>

            <div className="animated-bowl">
              <div className="bowl">
                <div className="salad">🥗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diet Preferences */}
      <section className="diet-preferences">
        <div className="container">
          <h2 className="section-title">
            Choose Your <span className="gradient-text">Preference</span>
          </h2>

          <div className="preference-buttons">
            <button
              className={`preference-btn ${
                dietPreference === "veg" ? "active" : ""
              }`}
              onClick={() => setDietPreference("veg")}
            >
              <i className="fas fa-leaf"></i>
              Vegetarian
            </button>
            <button
              className={`preference-btn ${
                dietPreference === "non-veg" ? "active" : ""
              }`}
              onClick={() => setDietPreference("non-veg")}
            >
              <i className="fas fa-drumstick-bite"></i>
              Non-Vegetarian
            </button>
            <button
              className={`preference-btn ${
                dietPreference === "vegan" ? "active" : ""
              }`}
              onClick={() => setDietPreference("vegan")}
            >
              <i className="fas fa-seedling"></i>
              Vegan
            </button>
          </div>
        </div>
      </section>

      {/* Meal Planner */}
      <section className="meal-planner">
        <div className="container">
          <div className="planner-layout">
            {/* Meal Categories */}
            <div className="meal-categories">
              {[
                "morning_drink",
                "breakfast",
                "lunch",
                "snack",
                "dinner",
                "detox",
              ].map((category) => (
                <div key={category} className="meal-category">
                  <h3 className="category-title">
                    <i
                      className={`fas fa-${
                        category === "breakfast"
                          ? "sun"
                          : category === "lunch"
                          ? "cloud-sun"
                          : category === "dinner"
                          ? "moon"
                          : category === "snack"
                          ? "cookie-bite"
                          : category === "morning_drink"
                          ? "mug-hot"
                          : "tint"
                      }`}
                    ></i>
                    {category === "morning_drink"
                      ? "Morning Drinks"
                      : category === "detox"
                      ? "Detox Drinks"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>

                  <div
                    className="meal-items"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 10,
                      maxHeight: 260,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {getFilteredMeals(category).map((meal) => (
                      <div
                        key={meal.id}
                        className="meal-card"
                        style={{
                          borderRadius: 10,
                          padding: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div className="meal-image">{meal.image}</div>
                        <div className="meal-info">
                          <h4>{meal.name}</h4>
                          <div className="meal-nutrition">
                            <span>{meal.calories} cal</span>
                            <span>{meal.protein}g protein</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-add-meal"
                          onClick={() => addMealToPlanner(meal)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Selected Meals */}
                  <div
                    className="selected-meals"
                    style={{
                      marginTop: 10,
                      maxHeight: 140,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {selectedMeals[category].map((meal, index) => (
                      <div
                        key={`${meal.id}-${index}`}
                        className="selected-meal"
                      >
                        <span>
                          {meal.image} {meal.name}
                        </span>
                        <button
                          className="btn-remove"
                          onClick={() =>
                            removeMealFromPlanner(meal.id, category)
                          }
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrition Summary */}
            <div className="nutrition-summary">
              <h3>Daily Nutrition</h3>
              <div className="nutrition-stats">
                <div className="nutrition-stat">
                  <div className="stat-circle calories">
                    <span>{getTotalNutrition().calories}</span>
                  </div>
                  <label>Calories</label>
                </div>

                <div className="nutrition-stat">
                  <div className="stat-circle protein">
                    <span>{getTotalNutrition().protein}g</span>
                  </div>
                  <label>Protein</label>
                </div>

                <div className="nutrition-stat">
                  <div className="stat-circle carbs">
                    <span>{getTotalNutrition().carbs}g</span>
                  </div>
                  <label>Carbs</label>
                </div>

                <div className="nutrition-stat">
                  <div className="stat-circle fat">
                    <span>{getTotalNutrition().fat}g</span>
                  </div>
                  <label>Fat</label>
                </div>
              </div>

              <button className="btn btn-save-plan" onClick={saveMealPlan}>
                <i className="fas fa-save"></i>
                Save Meal Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DietPage;
