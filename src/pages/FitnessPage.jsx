import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fitnessAPI } from "../utils/api";
import "./FitnessPage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FitnessPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workout_type: "cardio",
    duration: "",
    intensity: "moderate",
    calories_burned: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    weeklyGoal: 5,
  });

  // User profile state
  const [userProfile, setUserProfile] = useState({
    body_weight: "",
    height: "",
    age: "",
    goal: "maintenance",
    injury: "",
    is_pregnant: false,
  });
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [userProfileId, setUserProfileId] = useState(null);
  const [profileSaveStatus, setProfileSaveStatus] = useState("idle"); // idle | saving | success | error
  const [profileSaveMessage, setProfileSaveMessage] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [profileDraft, setProfileDraft] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const [trendRange, setTrendRange] = useState("7");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [dailyPlan, setDailyPlan] = useState([]);
  const [dailyChecks, setDailyChecks] = useState({});

  const loadWorkouts = useCallback(async () => {
    try {
      const response = await fitnessAPI.getHistory();
      if (response.status >= 200 && response.status < 300) {
        setWorkouts(Array.isArray(response.data) ? response.data : []);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Failed to load workouts:", error);
      setWorkouts([]);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const res = await fitnessAPI.getWorkoutPlans();
      if (res.status >= 200 && res.status < 300 && Array.isArray(res.data)) {
        setWorkoutPlans(res.data);
      } else {
        setWorkoutPlans([]);
      }
    } catch (e) {
      setWorkoutPlans([]);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const response = await fitnessAPI.getUserProfile();
      if (response.status >= 200 && response.status < 300 && response.data) {
        const profile = {
          body_weight: response.data.body_weight ?? "",
          height: response.data.height ?? "",
          age: response.data.age ?? "",
          goal: response.data.goal ?? "maintenance",
          injury: response.data.injury ?? "",
          is_pregnant: Boolean(response.data.is_pregnant),
        };
        setUserProfile(profile);
        setProfileDraft(profile);
        setUserProfileId(response.data.id ?? null);
        // load plans for this profile
        loadPlans();
      } else if (response.status === 404) {
        // Profile not found; set to create mode
        setUserProfileId(null);
        setProfileDraft({
          body_weight: "",
          height: "",
          age: "",
          goal: "maintenance",
          injury: "",
          is_pregnant: false,
        });
        setWorkoutPlans([]);
      } else {
        setUserProfile({
          body_weight: "",
          height: "",
          age: "",
          goal: "maintenance",
          injury: "",
          is_pregnant: false,
        });
        setProfileDraft({
          body_weight: "",
          height: "",
          age: "",
          goal: "maintenance",
          injury: "",
          is_pregnant: false,
        });
        setUserProfileId(null);
        setWorkoutPlans([]);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setUserProfile({
        body_weight: "",
        height: "",
        age: "",
        goal: "maintenance",
        injury: "",
        is_pregnant: false,
      });
      setProfileDraft({
        body_weight: "",
        height: "",
        age: "",
        goal: "maintenance",
        injury: "",
        is_pregnant: false,
      });
      setUserProfileId(null);
      setWorkoutPlans([]);
    }
  }, [loadPlans]);

  useEffect(() => {
    loadWorkouts();
    loadUserProfile();
  }, [loadWorkouts, loadUserProfile]);

  const calculateStats = useCallback(() => {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + (parseInt(workout.duration, 10) || 0),
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + (parseInt(workout.calories_burned, 10) || 0),
      0
    );

    setStats({
      totalWorkouts,
      totalDuration,
      totalCalories,
      weeklyGoal: 5,
    });
  }, [workouts]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "is_pregnant") {
      if (editMode) {
        setProfileDraft((prev) => ({ ...prev, [name]: checked }));
      } else {
        setUserProfile((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name in userProfile) {
      if (editMode) {
        setProfileDraft((prev) => ({ ...prev, [name]: value }));
      } else {
        setUserProfile((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateProfile = (p) => {
    const errors = [];
    const weight = parseFloat(p.body_weight);
    const height = parseFloat(p.height);
    const age = parseInt(p.age, 10);
    if (isNaN(weight) || weight <= 0)
      errors.push("Weight must be greater than 0.");
    if (isNaN(height) || height <= 0)
      errors.push("Height must be greater than 0.");
    if (isNaN(age) || age <= 0) errors.push("Age must be greater than 0.");
    if (
      ![
        "muscle_gain",
        "fat_loss",
        "weight_loss",
        "maintenance",
        "other",
      ].includes(p.goal)
    ) {
      errors.push("Invalid fitness goal.");
    }
    return errors;
  };

  const saveProfile = useCallback(async () => {
    const profileToSave = editMode ? profileDraft : userProfile;
    const errors = validateProfile(profileToSave);
    if (errors.length) {
      setProfileSaveStatus("error");
      setProfileSaveMessage(errors.join(" "));
      return;
    }

    setIsProfileSubmitting(true);
    setProfileSaveStatus("saving");
    setProfileSaveMessage("Saving profile...");
    try {
      const dataToSubmit = {
        ...profileToSave,
        id: userProfileId ?? undefined,
      };

      // Coerce types
      dataToSubmit.body_weight = parseFloat(dataToSubmit.body_weight);
      dataToSubmit.height = parseFloat(dataToSubmit.height);
      dataToSubmit.age = parseInt(dataToSubmit.age, 10);
      dataToSubmit.is_pregnant = Boolean(dataToSubmit.is_pregnant);

      const response = await fitnessAPI.updateUserProfile(dataToSubmit);
      if (response.status >= 200 && response.status < 300) {
        const saved = response.data || dataToSubmit;
        if (response.data && response.data.id) {
          setUserProfileId(response.data.id);
        }
        // Immediately reflect latest saved data in UI
        const normalized = {
          body_weight: saved.body_weight,
          height: saved.height,
          age: saved.age,
          goal: saved.goal,
          injury: saved.injury || "",
          is_pregnant: Boolean(saved.is_pregnant),
        };
        setUserProfile(normalized);
        setProfileDraft(normalized);
        setEditMode(false);
        setProfileSaveStatus("success");
        setProfileSaveMessage("Profile saved successfully.");
        // Refresh plans based on new profile
        loadPlans();
      } else {
        const detail =
          response?.data?.detail ||
          response?.message ||
          "Failed to save profile.";
        setProfileSaveStatus("error");
        setProfileSaveMessage(detail);
      }
    } catch (error) {
      setProfileSaveStatus("error");
      setProfileSaveMessage(error?.message || "Failed to save profile.");
    } finally {
      setIsProfileSubmitting(false);
    }
  }, [userProfile, userProfileId, editMode, profileDraft, loadPlans]);

  // Auto-hide save message after a short delay
  useEffect(() => {
    if (profileSaveStatus === "success" || profileSaveStatus === "error") {
      const t = setTimeout(() => {
        setProfileSaveStatus("idle");
        setProfileSaveMessage("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [profileSaveStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.duration || !formData.calories_burned) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const workoutData = {
        ...formData,
        duration: parseInt(formData.duration, 10),
        calories_burned: parseInt(formData.calories_burned, 10),
        date: new Date().toISOString().split("T")[0],
      };

      const response = await fitnessAPI.logWorkout(workoutData);
      if (response.status >= 200 && response.status < 300) {
        setFormData({
          workout_type: "cardio",
          duration: "",
          intensity: "moderate",
          calories_burned: "",
          notes: "",
        });
        setShowForm(false);
        loadWorkouts();
      } else {
        alert("Failed to save workout. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Failed to save workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!window.confirm("Are you sure you want to delete this workout?"))
      return;

    try {
      const response = await fitnessAPI.deleteWorkout(workoutId);
      if (response.status >= 200 && response.status < 300) {
        loadWorkouts();
      } else {
        alert("Failed to delete workout. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete workout:", error);
      alert("Failed to delete workout. Please try again.");
    }
  };

  const getWorkoutTypeIcon = (workoutType) => {
    const icons = {
      cardio: "🏃‍♂️",
      strength: "💪",
      yoga: "🧘‍♀️",
      swimming: "🏊‍♂️",
      cycling: "🚴‍♂️",
      running: "🏃‍♀️",
      walking: "🚶‍♂️",
    };
    return icons[workoutType] || "🏋️‍♂️";
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      low: "#4CAF50",
      moderate: "#FF9800",
      high: "#F44336",
    };
    return colors[intensity] || "#FF9800";
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const chartData = useMemo(() => {
    const days = parseInt(trendRange, 10);
    const lastDays = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const workoutData = lastDays.map((date) => {
      const dayWorkouts = workouts.filter((w) => w.date === date);
      return {
        date,
        count: dayWorkouts.length,
        duration: dayWorkouts.reduce(
          (sum, w) => sum + (parseInt(w.duration, 10) || 0),
          0
        ),
        calories: dayWorkouts.reduce(
          (sum, w) => sum + (parseInt(w.calories_burned, 10) || 0),
          0
        ),
      };
    });

    return {
      labels: workoutData.map((d) =>
        new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", {
          month: days > 15 ? "short" : undefined,
          day: days > 15 ? "numeric" : undefined,
          weekday: days <= 15 ? "short" : undefined,
        })
      ),
      datasets: [
        {
          label: "Workouts",
          data: workoutData.map((d) => d.count),
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
        },
      ],
    };
  }, [workouts, trendRange]);

  const doughnutData = useMemo(() => {
    const completed = Math.min(stats.totalWorkouts, stats.weeklyGoal);
    const remaining = Math.max(0, stats.weeklyGoal - completed);

    return {
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [completed, remaining],
          backgroundColor: ["#4CAF50", "#e9ecef"],
          borderColor: ["#4CAF50", "#e9ecef"],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  const weeklyGoalPct = useMemo(() => {
    if (!stats.weeklyGoal) return 0;
    return Math.min(
      100,
      Math.round((stats.totalWorkouts / stats.weeklyGoal) * 100)
    );
  }, [stats]);

  const bmi = useMemo(() => {
    const w = parseFloat(userProfile.body_weight);
    const h = parseFloat(userProfile.height);
    if (!w || !h) return null;
    const hm = h / 100;
    if (!hm) return null;
    const v = w / (hm * hm);
    return Number.isFinite(v) ? v.toFixed(1) : null;
  }, [userProfile.body_weight, userProfile.height]);

  const progressCounts = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastDays = (n) =>
      Array.from({ length: n }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      });
    const inLast = (n) => {
      const set = new Set(lastDays(n));
      return workouts.filter((w) => set.has(w.date)).length;
    };
    return {
      today: workouts.filter((w) => w.date === todayStr).length,
      week: inLast(7),
      fifteen: inLast(15),
      month: inLast(30),
    };
  }, [workouts]);

  const getDayType = useCallback((dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0=Sun
    // Map based on the table schedule
    switch (day) {
      case 1: // Mon
      case 3: // Wed
      case 5: // Fri
        return "strength";
      case 2: // Tue
      case 4: // Thu
        return "cardio";
      case 6: // Sat
        return "strength";
      case 0: // Sun
      default:
        return "rest";
    }
  }, []);

  const deriveDailyPlan = useCallback(
    (dateStr) => {
      const dayType = getDayType(dateStr);

      // Default exercises based on the workout plan table in UI
      const defaultExercisesByDayType = {
        strength: [
          { name: "Push-ups", sets: 3, reps: 12 },
          { name: "Squats", sets: 3, reps: 12 },
          { name: "Deadlifts", sets: 3, reps: 12 },
          { name: "Lunges", sets: 3, reps: 12 },
          { name: "Bench Press", sets: 3, reps: 12 },
          { name: "Pull-ups", sets: 3, reps: 12 },
        ],
        cardio: [
          { name: "Running", sets: 2, reps: 15 },
          { name: "Cycling", sets: 2, reps: 15 },
          { name: "Jump Rope", sets: 2, reps: 15 },
          { name: "Swimming", sets: 2, reps: 15 },
          { name: "Jogging", sets: 2, reps: 15 },
          { name: "Rowing", sets: 2, reps: 15 },
        ],
        rest: [],
      };

      if (!Array.isArray(workoutPlans) || workoutPlans.length === 0) {
        return defaultExercisesByDayType[dayType] || [];
      }

      if (dayType === "rest") return [];

      // Flatten all plan exercises
      const allExercises = workoutPlans.flatMap((p) =>
        Array.isArray(p.exercises) ? p.exercises : []
      );
      const matchesType = (name) => {
        const n = (name || "").toLowerCase();
        if (dayType === "strength")
          return /strength|push|squat|deadlift|lunge|press|pull/.test(n);
        if (dayType === "cardio")
          return /cardio|run|jog|cycle|swim|jump/.test(n);
        return true;
      };
      let filtered = allExercises.filter((ex) =>
        matchesType(ex.name || String(ex))
      );
      if (filtered.length === 0) filtered = allExercises.slice();
      // Limit and normalize
      const limited = filtered.slice(0, 6).map((ex) => ({
        name: ex.name || (typeof ex === "string" ? ex : JSON.stringify(ex)),
        sets: ex.sets ?? (dayType === "strength" ? 3 : 2),
        reps: ex.reps ?? (dayType === "strength" ? 12 : 15),
        duration: ex.duration ?? null,
      }));
      return limited;
    },
    [workoutPlans, getDayType]
  );

  useEffect(() => {
    setDailyPlan(deriveDailyPlan(selectedDate));
    setDailyChecks({});
  }, [deriveDailyPlan, selectedDate]);

  const toggleDailyCheck = (idx) => {
    setDailyChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const banner = (type, message) => (
    <div
      className={`banner banner-${type}`}
      style={{
        marginBottom: "12px",
        padding: "10px 12px",
        borderRadius: 6,
        backgroundColor:
          type === "success"
            ? "#e6ffed"
            : type === "error"
            ? "#ffe6e6"
            : "#f0f0f0",
        color:
          type === "success"
            ? "#046c4e"
            : type === "error"
            ? "#8a1f11"
            : "#333",
        border: `1px solid ${
          type === "success" ? "#abefc6" : type === "error" ? "#ffb3b3" : "#ddd"
        }`,
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );

  return (
    <div className="fitness-page">
      <div className="page-header">
        <h1 className="page-title">
          Fitness <span className="gradient-text">Tracker</span>
        </h1>
        <p className="page-subtitle">
          Monitor your workouts and track your progress
        </p>
      </div>

      <div
        className="fitness-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px",
          display: "grid",
          gap: "24px",
        }}
      >
        {/* User Profile Input */}
        <div className="user-profile-section">
          <h2>User Profile</h2>
          {profileSaveStatus !== "idle" &&
            profileSaveMessage &&
            banner(
              profileSaveStatus === "saving"
                ? "info"
                : profileSaveStatus === "success"
                ? "success"
                : "error",
              profileSaveMessage
            )}
          {!editMode ? (
            <div className="user-profile-summary">
              <div>Height – {userProfile.height || "-"} cm</div>
              <div>Weight – {userProfile.body_weight || "-"} kg</div>
              <div>BMI – {bmi ?? "-"}</div>
              <div>Age – {userProfile.age || "-"}</div>
              <div>Injury – {userProfile.injury || "None"}</div>
              <div>Pregnant – {userProfile.is_pregnant ? "Yes" : "No"}</div>
              <div className="form-actions" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setProfileDraft({ ...userProfile });
                    setEditMode(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form
              className="user-profile-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-group">
                <label htmlFor="body_weight">Weight (kg):</label>
                <input
                  type="number"
                  id="body_weight"
                  name="body_weight"
                  value={
                    editMode
                      ? profileDraft?.body_weight ?? ""
                      : userProfile.body_weight
                  }
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (cm):</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={
                    editMode ? profileDraft?.height ?? "" : userProfile.height
                  }
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age (years):</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={editMode ? profileDraft?.age ?? "" : userProfile.age}
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label htmlFor="goal">Fitness Goal:</label>
                <select
                  id="goal"
                  name="goal"
                  value={
                    editMode
                      ? profileDraft?.goal ?? "maintenance"
                      : userProfile.goal
                  }
                  onChange={handleInputChange}
                  disabled={!editMode}
                >
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="injury">Physical Injury (optional):</label>
                <input
                  type="text"
                  id="injury"
                  name="injury"
                  value={
                    editMode ? profileDraft?.injury ?? "" : userProfile.injury
                  }
                  onChange={handleInputChange}
                  placeholder="e.g., fracture, sprain, back pain"
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label htmlFor="is_pregnant">Pregnant (optional):</label>
                <input
                  type="checkbox"
                  id="is_pregnant"
                  name="is_pregnant"
                  checked={Boolean(
                    editMode
                      ? profileDraft?.is_pregnant
                      : userProfile.is_pregnant
                  )}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              <div className="form-actions">
                {!editMode ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setProfileDraft({ ...userProfile });
                      setEditMode(true);
                    }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setProfileDraft({ ...userProfile });
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={saveProfile}
                      disabled={isProfileSubmitting}
                      style={{ marginLeft: 8 }}
                    >
                      {isProfileSubmitting ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Workout Plan Section */}
        <div className="workout-plan-section">
          <h2>Workout Plan</h2>
          <table className="workout-plan-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Week 1</td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Pilates / Stretches</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="rest-day">Rest Day</div>
                </td>
              </tr>
              <tr>
                <td>Week 2</td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Pilates / Stretches</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="rest-day">Rest Day</div>
                </td>
              </tr>
              <tr>
                <td>Week 3</td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Pilates / Stretches</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="rest-day">Rest Day</div>
                </td>
              </tr>
              <tr>
                <td>Week 4</td>
                <td>
                  <div className="activity">Pilates / Stretches</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Cardio</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">20 Minutes</div>
                </td>
                <td>
                  <div className="activity">Strength Training</div>
                  <div className="time">30 Minutes</div>
                </td>
                <td>
                  <div className="rest-day">Rest Day</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Daily Plan (based on profile and plans) */}
          <div
            className="daily-plan-section"
            style={{
              background: "#fff",
              color: "#111",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0 }}>Today's Plan</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  backgroundColor: "#fafafa",
                  color: "#111",
                }}
              />
            </div>
            {dailyPlan.length === 0 ? (
              <div className="empty-state" style={{ color: "#333" }}>
                <p style={{ margin: 0 }}>
                  No exercises scheduled for this day. Enjoy your rest or log a
                  light activity.
                </p>
              </div>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {dailyPlan.map((ex, idx) => (
                  <li
                    key={idx}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 10,
                      padding: 12,
                      background: "#fafafa",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        cursor: "pointer",
                        color: "#111",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!dailyChecks[idx]}
                        onChange={() => toggleDailyCheck(idx)}
                        style={{ marginTop: 4 }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{ex.name}</div>
                        <div style={{ color: "#666", fontSize: 13 }}>
                          {ex.sets} sets × {ex.reps} reps
                          {ex.duration ? ` • ${ex.duration} min` : ""}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Plans based on profile */}
          <div className="workout-plans-section">
            <h3>Recommended Workout Plans</h3>
            {workoutPlans && workoutPlans.length ? (
              <div className="plans-grid">
                {workoutPlans.map((plan) => (
                  <div key={plan.id || plan.name} className="plan-card">
                    <div className="plan-header">
                      <h4>{plan.name}</h4>
                      {plan.goal && (
                        <span className="plan-goal">{plan.goal}</span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="plan-desc">{plan.description}</p>
                    )}
                    {Array.isArray(plan.warmup_exercises) &&
                      plan.warmup_exercises.length > 0 && (
                        <div className="plan-section">
                          <div className="plan-section-title">Warmup</div>
                          <ul>
                            {plan.warmup_exercises.map((w, idx) => (
                              <li key={idx}>
                                {typeof w === "string" ? w : JSON.stringify(w)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {Array.isArray(plan.exercises) &&
                      plan.exercises.length > 0 && (
                        <div className="plan-section">
                          <div className="plan-section-title">Exercises</div>
                          <ul>
                            {plan.exercises.map((ex, idx) => (
                              <li key={idx}>
                                {ex.name ||
                                  (typeof ex === "string"
                                    ? ex
                                    : JSON.stringify(ex))}
                                {ex.sets ? ` — ${ex.sets} sets` : ""}
                                {ex.reps ? ` x ${ex.reps} reps` : ""}
                                {ex.duration ? ` (${ex.duration} min)` : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>
                  No plans available. Save your profile to see personalized
                  plans.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">🏃‍♂️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalWorkouts}</div>
              <div className="stat-label">Total Workouts</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">
                {Math.round(stats.totalDuration / 60)}
              </div>
              <div className="stat-label">Hours</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCalories}</div>
              <div className="stat-label">Calories Burned</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{weeklyGoalPct}%</div>
              <div className="stat-label">Weekly Goal</div>
            </div>
          </div>
        </div>

        {/* Range Progress Summary */}
        <div
          className="range-progress"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          <div
            className="range-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>Today</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {progressCounts.today}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>workout(s)</div>
          </div>
          <div
            className="range-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>Last 7 days</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {progressCounts.week}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>workout(s)</div>
          </div>
          <div
            className="range-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>Last 15 days</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {progressCounts.fifteen}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>workout(s)</div>
          </div>
          <div
            className="range-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>Last 30 days</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {progressCounts.month}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>workout(s)</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="progress-section">
          <div className="progress-card">
            <h3>Weekly Progress</h3>
            <div
              className="progress-ring-container"
              style={{
                width: "320px",
                height: "320px",
                borderRadius: "25%",
                position: "relative",
              }}
            >
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div
                className="progress-center"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div className="progress-text">
                  <div className="progress-number">{stats.totalWorkouts}</div>
                  <div className="progress-label">of {stats.weeklyGoal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Weekly Workout Trend</h3>
            <select
              onChange={(e) => setTrendRange(e.target.value)}
              value={trendRange}
              style={{ marginBottom: "1rem" }}
            >
              <option value="7">Weekly</option>
              <option value="15">15 Days</option>
              <option value="30">Monthly</option>
            </select>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Controls */}
        <div className="fitness-controls">
          <button
            className="btn btn-primary add-workout-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Workout
          </button>
        </div>

        {/* Workout Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Log New Workout</h2>
              <form onSubmit={handleSubmit} className="workout-form">
                <div className="form-group">
                  <label htmlFor="workout_type">Workout Type:</label>
                  <select
                    id="workout_type"
                    name="workout_type"
                    value={formData.workout_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength Training</option>
                    <option value="yoga">Yoga</option>
                    <option value="swimming">Swimming</option>
                    <option value="cycling">Cycling</option>
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="duration">Duration (minutes):</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 45"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="intensity">Intensity:</label>
                    <select
                      id="intensity"
                      name="intensity"
                      value={formData.intensity}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="calories_burned">Calories Burned:</label>
                  <input
                    type="number"
                    id="calories_burned"
                    name="calories_burned"
                    value={formData.calories_burned}
                    onChange={handleInputChange}
                    placeholder="e.g., 300"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes (optional):</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="How did your workout feel? Any achievements?"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Workout"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workouts List */}
        <div className="workouts-section">
          <h2>Recent Workouts</h2>
          {workouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏋️‍♂️</div>
              <p>No workouts logged yet</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Log Your First Workout
              </button>
            </div>
          ) : (
            <div className="workouts-list">
              {workouts.slice(0, 10).map((workout) => (
                <div key={workout.id} className="workout-card">
                  <div className="workout-header">
                    <div className="workout-type">
                      {getWorkoutTypeIcon(workout.workout_type)}{" "}
                      {workout.workout_type.charAt(0).toUpperCase() +
                        workout.workout_type.slice(1)}
                    </div>
                    <div
                      className="workout-intensity"
                      style={{
                        backgroundColor: getIntensityColor(workout.intensity),
                      }}
                    >
                      {workout.intensity}
                    </div>
                  </div>
                  <div className="workout-details">
                    <div className="workout-stat">
                      <span className="stat-icon">⏱️</span>
                      {workout.duration} min
                    </div>
                    <div className="workout-stat">
                      <span className="stat-icon">🔥</span>
                      {workout.calories_burned} cal
                    </div>
                    <div className="workout-date">
                      {new Date(
                        `${workout.date}T00:00:00`
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  {workout.notes && (
                    <div className="workout-notes">{workout.notes}</div>
                  )}
                  <div className="workout-actions">
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => deleteWorkout(workout.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessPage;
