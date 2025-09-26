"use client";

import React, { useState, useRef } from "react";

const EmotionPage = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [emotionText, setEmotionText] = useState("");
  const [emotionResult, setEmotionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [persistToServer, setPersistToServer] = useState(false);
  const [storedResultId, setStoredResultId] = useState(null);
  const [storedImageUrl, setStoredImageUrl] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const fileInputRef = useRef(null);

  const moods = [
    { name: "Happy", emoji: "😊", color: "#FFD700" },
    { name: "Sad", emoji: "😢", color: "#4A90E2" },
    { name: "Angry", emoji: "😡", color: "#FF6B6B" },
    { name: "Anxious", emoji: "😰", color: "#FF8C42" },
    { name: "Excited", emoji: "🤩", color: "#FF69B4" },
    { name: "Calm", emoji: "😌", color: "#98D8C8" },
    { name: "Tired", emoji: "😴", color: "#B19CD9" },
    { name: "Confused", emoji: "🤔", color: "#95A5A6" },
    { name: "Neutral", emoji: "😐", color: "#9E9E9E" },
  ];

  const EMOTION_DEFS = {
    Happy: { emoji: "😊", color: "#FFD700", keywords: ["happy","joy","joyful","delighted","cheerful","glad","content","grateful","blessed","smile","smiling","great","good","awesome","amazing","fantastic","love","😍","😄","😃","😁","🙂","😆"] },
    Sad: { emoji: "😢", color: "#4A90E2", keywords: ["sad","down","unhappy","depressed","cry","crying","tears","blue","lonely","heartbroken","😢","😭","😞","😔"] },
    Angry: { emoji: "😡", color: "#FF6B6B", keywords: ["angry","mad","furious","rage","irritated","annoyed","frustrated","pissed","hate","😡","🤬"] },
    Anxious: { emoji: "😰", color: "#FF8C42", keywords: ["anxious","nervous","worried","tense","panic","stressed","overwhelmed","fear","afraid","scared","😰","😟","😨","😱"] },
    Excited: { emoji: "🤩", color: "#FF69B4", keywords: ["excited","thrilled","pumped","hyped","ecstatic","can’t wait","can't wait","yay","woohoo","🤩","🎉","🔥"] },
    Calm: { emoji: "😌", color: "#98D8C8", keywords: ["calm","peaceful","relaxed","chill","serene","at ease","😌"] },
    Tired: { emoji: "😴", color: "#B19CD9", keywords: ["tired","sleepy","exhausted","fatigued","drained","burnt out","burned out","😴","🥱"] },
    Confused: { emoji: "🤔", color: "#95A5A6", keywords: ["confused","unsure","uncertain","don’t know","don't know","what","why","huh","🤔","😕"] },
    Neutral: { emoji: "😐", color: "#9E9E9E", keywords: [] },
  };

  function analyzeTextEmotion(text, selected) {
    const scores = Object.fromEntries(Object.keys(EMOTION_DEFS).map(k => [k, 0]));
    const t = (text || "").toLowerCase();
    for (const [label, def] of Object.entries(EMOTION_DEFS)) {
      def.keywords.forEach(kw => {
        const kwLower = kw.toLowerCase();
        if (t.includes(kwLower)) scores[label] += 1;
      });
    }
    // Boost selected mood if any
    if (selected && scores[selected] !== undefined) scores[selected] += 2;

    // Detect explicit emoji characters in text
    Object.entries(EMOTION_DEFS).forEach(([label, def]) => {
      def.keywords.forEach(kw => {
        if (/^[\p{Emoji}\p{Extended_Pictographic}]$/u.test(kw) && text.includes(kw)) {
          scores[label] += 2;
        }
      })
    });

    // Pick dominant
    const entries = Object.entries(scores);
    entries.sort((a,b) => b[1]-a[1]);
    const [topLabel, topScore] = entries[0];
    const sum = entries.reduce((acc, [,v]) => acc + Math.max(0,v), 0);
    const confidence = sum ? Math.min(100, Math.round((Math.max(0, topScore) / sum) * 100) + 30) : 55;
    const finalLabel = topScore > 0 ? topLabel : (selected || 'Neutral');
    return { label: finalLabel, confidence };
  }

  function recommendationsFor(label){
    switch(label){
      case 'Happy': return ["Share your joy with someone","Do something creative","Capture this moment in a journal","Plan a fun activity for later"];
      case 'Sad': return ["Reach out to a friend","Take a short walk outside","Write down three things you’re grateful for","Listen to calming music"];
      case 'Angry': return ["Try box breathing: 4-4-4-4","Do 10 minutes of light exercise","Step away and hydrate","Write what triggered you and one constructive step"];
      case 'Anxious': return ["Do a 3-minute breathing exercise","Try grounding: 5-4-3-2-1","Limit caffeine for now","Text someone you trust"];
      case 'Excited': return ["Channel it into a task","Share the news","Make a small plan","Take a photo to remember it"];
      case 'Calm': return ["Enjoy a mindful tea","Stretch for 5 minutes","Keep notifications minimal","Savor a quiet moment"];
      case 'Tired': return ["Drink water and stretch","Short power nap if possible","Adjust tonight’s bedtime","Reduce screen brightness"];
      case 'Confused': return ["Write your top question","Break task into steps","Ask for a quick second opinion","Take a 5-min break and revisit"];
      default: return ["Take a deep breath","Drink water","Move gently for 2 minutes","Note how you feel"];
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeEmotion = async () => {
    if (!selectedMood && !uploadedImage && !emotionText) {
      alert("Please select a mood, upload an image, or enter text");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Client-side emotion inference (text + emoji + selected mood)
      const { label, confidence } = analyzeTextEmotion(emotionText, selectedMood);
      const picked = EMOTION_DEFS[label] || EMOTION_DEFS['Neutral'];

      const result = {
        emotion: label,
        emoji: picked.emoji,
        color: picked.color,
        confidence,
        recommendations: recommendationsFor(label),
      };
      setEmotionResult(result);

      // Optional: persist securely to server if user opts in
      if (persistToServer) {
        try {
          const formData = new FormData();
          if (uploadedImage) {
            const res = await fetch(uploadedImage);
            const blob = await res.blob();
            formData.append('image', blob, 'upload.png');
          }
          formData.append('mood', emotionText || selectedMood || label);
          formData.append('persist', 'true');
          const resp = await fetch('/emotion/api/detect/', { method: 'POST', body: formData, credentials: 'include' });
          if (resp.ok) {
            const saved = await resp.json();
            if (saved && saved.id) {
              setStoredResultId(saved.id);
              setStoredImageUrl(saved.image_url || null);
            }
          }
        } catch { /* ignore server errors; UI already shows result */ }
      }
    } catch (error) {
      alert('Could not analyze at the moment.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setEmotionResult(null);
    setSelectedMood("");
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="emotion-page">
      {/* Hero Section */}
      <section className="emotion-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Emotion <span className="gradient-text">Detection</span>
            </h1>
            <p>
              Understand and manage your emotional state with AI-powered
              analysis
            </p>
          </div>

          {/* Floating Emojis */}
          <div className="floating-emojis">
            {moods.map((mood, index) => (
              <div
                key={mood.name}
                className="floating-emoji"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  color: mood.color,
                }}
              >
                {mood.emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotion Analysis */}
      <section className="emotion-analysis">
        <div className="container">
          {!emotionResult ? (
            <div className="analysis-input">
              <h2 className="section-title">
                How Are You <span className="gradient-text">Feeling?</span>
              </h2>

              {/* Mood Selection */}
              <div className="mood-selection">
                <h3>Select Your Current Mood</h3>
                <div className="mood-grid">
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      className={`mood-btn ${
                        selectedMood === mood.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedMood(mood.name)}
                      style={{ "--mood-color": mood.color }}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span className="mood-name">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="text-input" style={{ marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Or Describe Your Feelings
                </h3>
                <textarea
                  value={emotionText}
                  onChange={(e) => setEmotionText(e.target.value)}
                  placeholder="Tell us how you're feeling in your own words..."
                  className="emotion-textarea"
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: "#1e1e2f",
                    color: "#fff",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Image Upload */}
              <div className="image-upload" style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#8e44ad",
                  }}
                >
                  Or Upload Your Photo
                </h3>
                <div
                  className="upload-area"
                  style={{
                    border: "2px dashed #8e44ad",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: "#8e44ad",
                    backgroundColor: "#1e1e2f",
                  }}
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="file-input"
                    style={{ display: "none" }}
                  />
                  <div className="upload-content">
                    {uploadedImage ? (
                      <div
                        className="uploaded-image"
                        style={{ position: "relative" }}
                      >
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded"
                          style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                        <button
                          className="btn-remove-image"
                          onClick={() => setUploadedImage(null)}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "#8e44ad",
                            border: "none",
                            borderRadius: "50%",
                            color: "#fff",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <i
                          className="fas fa-camera"
                          style={{ fontSize: "36px", marginBottom: "8px" }}
                        ></i>
                        <p style={{ fontWeight: "bold" }}>
                          Click to upload your photo
                        </p>
                        <span>We'll analyze your facial expression</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="privacy-controls" style={{ marginTop: 8, marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={persistToServer} onChange={(e) => setPersistToServer(e.target.checked)} />
                  <span>Save my analysis and photo to my account (optional)</span>
                </label>
                {!persistToServer && (
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
                    By default, your text and photo are processed on your device and not uploaded.
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <div className="analyze-section">
                <button
                  className="btn btn-analyze"
                  onClick={analyzeEmotion}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-brain"></i>
                      Analyze My Emotion
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="analysis-result">
              <div className="result-header">
                <h2 className="section-title">
                  Your Emotion <span className="gradient-text">Analysis</span>
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-reset" onClick={resetAnalysis}>
                    <i className="fas fa-redo"></i>
                    Analyze Again
                  </button>
                  {storedResultId && storedImageUrl && (
                    <button
                      className="btn btn-danger"
                      disabled={deleteInProgress}
                      onClick={async () => {
                        try {
                          setDeleteInProgress(true);
                          const resp = await fetch(`/emotion/api/results/${storedResultId}/`, { method: 'DELETE', credentials: 'include' });
                          if (resp.status === 204) {
                            setStoredResultId(null);
                            setStoredImageUrl(null);
                            setUploadedImage(null); // also clear local copy
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            alert('Stored photo and record deleted successfully.');
                          } else {
                            alert('Could not delete stored photo.');
                          }
                        } finally {
                          setDeleteInProgress(false);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i>
                      Delete stored photo
                    </button>
                  )}
                </div>
              </div>

              <div className="result-content">
                <div className="emotion-display">
                  <div
                    className="emotion-circle"
                    style={{
                      background: `linear-gradient(135deg, ${emotionResult.color}40, ${emotionResult.color}80)`,
                    }}
                  >
                    <span className="emotion-emoji">{emotionResult.emoji}</span>
                  </div>
                  <h3 className="emotion-name">{emotionResult.emotion}</h3>
                  <div className="confidence-bar">
                    <div className="confidence-label">Confidence</div>
                    <div className="confidence-progress">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${emotionResult.confidence}%`,
                          backgroundColor: emotionResult.color,
                        }}
                      ></div>
                    </div>
                    <div className="confidence-value">
                      {emotionResult.confidence}%
                    </div>
                  </div>
                </div>

                <div className="recommendations">
                  <h3>Personalized Recommendations</h3>
                  <div className="recommendation-cards">
                    {emotionResult.recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-card">
                        <div className="rec-icon">
                          <i
                            className={`fas fa-${
                              index === 0
                                ? "music"
                                : index === 1
                                ? "heart"
                                : index === 2
                                ? "running"
                                : "lightbulb"
                            }`}
                          ></i>
                        </div>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Emotion Tips */}
      <section className="emotion-tips">
        <div className="container">
          <h2 className="section-title">
            Emotional <span className="gradient-text">Wellness Tips</span>
          </h2>

          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">
                <i className="fas fa-spa"></i>
              </div>
              <h3>Practice Mindfulness</h3>
              <p>
                Take 5 minutes daily to focus on your breathing and be present
                in the moment.
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">
                <i className="fas fa-journal-whills"></i>
              </div>
              <h3>Keep a Journal</h3>
              <p>
                Write down your thoughts and feelings to better understand your
                emotional patterns.
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Connect with Others</h3>
              <p>
                Share your feelings with trusted friends or family members for
                support.
              </p>
            </div>

            <div className="tip-card">
              <div className="tip-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Spend Time in Nature</h3>
              <p>
                Natural environments can help reduce stress and improve your
                mood.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmotionPage;
