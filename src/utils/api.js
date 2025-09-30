const API_BASE_URL = "";
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getCsrfToken() {
    const name = "csrftoken";
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    // If no CSRF token in cookies, make a GET request to get one
    if (!cookieValue) {
      try {
        await fetch(`${this.baseURL}/auth-api/csrf/`, {
          method: "GET",
          credentials: "include",
        });
        // Try to get the token again after the request
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      } catch (error) {
        console.warn("Failed to get CSRF token:", error);
      }
    }

    return cookieValue;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log("API Request:", url, options);

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    // Add CSRF token for non-GET requests except for login and signup
    if (
      options.method &&
      options.method !== "GET" &&
      !endpoint.includes("/auth-api/login/") &&
      !endpoint.includes("/auth-api/signup/")
    ) {
      const csrfToken = await this.getCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (e) {
          data = null;
        }
      }

      console.log("API Response:", response.status, data);

      // Fix: For login and signup, return the full response including status and message
      if (
        endpoint.includes("/auth-api/login/") ||
        endpoint.includes("/auth-api/signup/")
      ) {
        return {
          data,
          status: response.status,
          message: data?.message,
          ok: response.ok,
        };
      }

      return {
        data,
        status: response.status,
        message: data?.message,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        data: null,
        status: 0,
        message: `API request failed: ${error?.message || error}`,
      };
    }
  }

  // Contact form submission
  async submitContactForm(formData) {
    return this.request("/contact/api/send/", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  // Emotion analysis
  async analyzeEmotion(data) {
    const formData = new FormData();
    if (data.mood) formData.append("mood", data.mood);
    if (data.image) formData.append("image", data.image);

    return this.request("/emotion/analyze/", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Meal plan operations
  async saveMealPlan(mealPlan) {
    return this.request("/diet/meal-plan/", {
      method: "POST",
      body: JSON.stringify(mealPlan),
    });
  }

  async getMealPlan() {
    return this.request("/diet/meal-plan/", {
      method: "GET",
    });
  }

  // Fitness tracking
  async logWorkout(workoutData) {
    return this.request("/fitness/api/workouts/log_workout/", {
      method: "POST",
      body: JSON.stringify(workoutData),
    });
  }

  async getWorkoutHistory() {
    return this.request("/fitness/api/workouts/history/", {
      method: "GET",
    });
  }

  async deleteWorkout(id) {
    return this.request(`/fitness/api/workouts/${id}/`, {
      method: "DELETE",
    });
  }

  async getWorkoutPlans() {
    return this.request("/fitness/api/workout-plans/", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper functions for common API operations
export const contactAPI = {
  submit: (formData) => apiClient.submitContactForm(formData),
};

export const emotionAPI = {
  analyze: (data) => apiClient.analyzeEmotion(data),
};

export const dietAPI = {
  savePlan: (plan) => apiClient.saveMealPlan(plan),
  getPlan: () => apiClient.getMealPlan(),
};

export const fitnessAPI = {
  logWorkout: (data) => apiClient.logWorkout(data),
  getHistory: () => apiClient.getWorkoutHistory(),
  deleteWorkout: (id) => apiClient.deleteWorkout(id),
  getWorkoutPlans: () => apiClient.getWorkoutPlans(),
  getUserProfile: () =>
    apiClient.request("/fitness/api/user-health-profile/me/", {
      method: "GET",
    }),
  updateUserProfile: (data) => {
    if (data.id) {
      // Update existing profile
      return apiClient.request(`/fitness/api/user-health-profile/${data.id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } else {
      // Create new profile
      return apiClient.request("/fitness/api/user-health-profile/", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  },
};

export const gamesAPI = {
  saveScore: (data) => apiClient.saveGameScore(data),
  getLeaderboard: (game) => apiClient.getGameLeaderboard(game),
};
