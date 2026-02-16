import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  updatePRSlot,
} from "../../../services/profileApi";
import api from "../../../services/api";
import { getExercisePR } from "../../../services/exerciseApi";
import ExerciseSelectModal from "../components/ExerciseSelectModal";
import ProfileRightPanel from "../components/ProfileRightPanel";
import "../styles/Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [range, setRange] = useState(7);
  const [prWeights, setPrWeights] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [durationData, setDurationData] = useState({ series: [], average: 0 });
  const [isLoadingDuration, setIsLoadingDuration] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    bio: "",
    height: "",
    weight: "",
    age: "",
  });
  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const rawMax = Math.max(...durationData.series.map((d) => d.duration / 60), 60);
  const maxDurationMins = Math.ceil(rawMax / 20) * 20;

  const yLabels = [
    maxDurationMins,
    Math.round(maxDurationMins * 0.75),
    Math.round(maxDurationMins * 0.5),
    Math.round(maxDurationMins * 0.25),
    0,
  ];

  const fetchData = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      setUserData(data);

      // === FIX START: Populate tempProfile with database values ===
      if (data?.profile?.profile) {
        const p = data.profile.profile;
        setTempProfile({
          bio: p.bio || "",
          height: p.height || "",
          weight: p.weight || "",
          age: p.age || "",
        });
      }
      // === FIX END ===

      if (data?.profile?.prSlots) {
        const prDetails = {};
        await Promise.all(
          data.profile.prSlots.map(async (slot) => {
            if (slot.exerciseId) {
              try {
                const prRes = await getExercisePR(slot.exerciseId);
                const weight = prRes?.weight || 0;
                const dateRaw = prRes?.date;

                prDetails[slot.exerciseId] = {
                  weight: weight,
                  date: dateRaw
                    ? new Date(dateRaw).toLocaleDateString("en-GB")
                    : "No Record",
                };
              } catch (err) {
                console.error(`Error fetching PR`, err);
              }
            }
          }),
        );
        setPrWeights(prDetails);
      }
    } catch (err) {
      console.error("Error fetching profile data", err);
    }
  };

  const fetchDurationStats = async () => {
    setIsLoadingDuration(true);
    try {
      const res = await api.get(`/profile/duration-stats?range=${range}`);
      setDurationData(res.data);
    } catch (err) {
      console.error("Failed to fetch duration stats", err);
    } finally {
      setIsLoadingDuration(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDurationStats();
  }, [range]);

  const formatMixedStats = (num, type) => {
    if (!num || num === 0) return "0";
    if (type === "exact" || num < 10000) {
      return num.toLocaleString();
    }
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 10000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const handleSave = async () => {
    try {
      const payload = {
        bio: tempProfile.bio,
        height: tempProfile.height === "" ? 0 : parseFloat(tempProfile.height),
        weight: tempProfile.weight === "" ? 0 : parseFloat(tempProfile.weight),
        age: tempProfile.age === "" ? 0 : parseInt(tempProfile.age),
      };

      await updateProfile(payload);
      setIsEditing(false);
      const res = await getProfile();
      setUserData(res.data);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleExerciseSelect = async (exerciseId) => {
    try {
      await updatePRSlot(activeSlot, exerciseId);
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Failed to update PR slot", err);
    }
  };

  if (!userData) {
    return (
      <div className="profile-container skeleton-page">
        <div className="profile-main-content">
          <section className="profile-hero glass-panel skeleton-hero">
            <div className="profile-avatar skeleton skeleton-circle"></div>
            <div className="hero-info">
              <div className="skeleton skeleton-title" style={{ width: '180px' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '250px' }}></div>
            </div>
          </section>
          <div className="stats-snapshot">
            {[1, 2, 3].map(i => <div key={i} className="stat-card glass-panel skeleton" style={{ height: '80px' }}></div>)}
          </div>
          <div className="glass-panel skeleton" style={{ height: '200px' }}></div>
        </div>
        <div className="profile-right-panel glass-panel skeleton"></div>
      </div>
    );
  }

  const { name, prSlots, profile } = userData.profile;

  return (
    <div className="profile-container">
      <div className="profile-main-content">
        {/* Hero Card */}
        <section className="profile-hero glass-panel">
          <div className="profile-avatar avatar-glow">
            <span className="avatar-initials">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>

          <div className="hero-info">
            <div className="hero-header-flex">
              <div className="name-edit-wrapper">
                <h2>{name}</h2>
                {/* Pencil/Tick Toggle Icon */}
                <button
                  className={`edit-icon-btn ${isEditing ? "is-saving" : ""}`}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  title={isEditing ? "Save Changes" : "Edit Profile"}
                >
                  {isEditing ? (
                    <span className="tick-icon">✔</span>
                  ) : (
                    <svg
                      className="pencil-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="hero-content-stack">
              {isEditing ? (
                <div className="edit-fields-container">
                  <textarea
                    maxLength={100}
                    value={tempProfile.bio}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, bio: e.target.value })
                    }
                    className="bio-edit-input"
                    autoFocus
                  />
                  <div className="metrics-row-refined">
                    <div className="metric-group">
                      <input
                        type="number"
                        value={tempProfile.age}
                        className="minimal-input-refined"
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            age: e.target.value,
                          })
                        }
                      />
                      <span className="metric-label-display">yrs</span>
                    </div>
                    <div className="metric-separator" />
                    <div className="metric-group">
                      <input
                        type="number"
                        step="0.1"
                        value={tempProfile.height}
                        className="minimal-input-refined"
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            height: e.target.value,
                          })
                        }
                      />
                      <span className="metric-label-display">cm</span>
                    </div>
                    <div className="metric-separator" />
                    <div className="metric-group">
                      <input
                        type="number"
                        step="0.1"
                        value={tempProfile.weight}
                        className="minimal-input-refined"
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            weight: e.target.value,
                          })
                        }
                      />
                      <span className="metric-label-display">kg</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="view-fields-container">
                  <p className="bio-text-static">
                    {profile?.bio || "No bio set yet."}
                  </p>
                  <div className="metrics-row-refined">
                    <div className="metric-group">
                      <span className="metric-value-display">
                        {profile?.age || "--"}
                      </span>
                      <span className="metric-label-display">yrs</span>
                    </div>
                    <div className="metric-separator" />
                    <div className="metric-group">
                      <span className="metric-value-display">
                        {profile?.height || "--"}
                      </span>
                      <span className="metric-label-display">cm</span>
                    </div>
                    <div className="metric-separator" />
                    <div className="metric-group">
                      <span className="metric-value-display">
                        {profile?.weight || "--"}
                      </span>
                      <span className="metric-label-display">kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-snapshot">
          <div className="stat-card glass-panel">
            <span className="stat-number">
              {formatMixedStats(userData?.stats?.totalWorkouts, "exact")}
            </span>
            <span className="stat-label">SESSIONS</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-number">
              {formatMixedStats(userData?.stats?.totalSets)}
            </span>
            <span className="stat-label">TOTAL SETS</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-number">
              {formatMixedStats(userData?.stats?.totalReps)}
            </span>
            <span className="stat-label">TOTAL REPS</span>
          </div>
        </section>

        {/* PR Grid */}
        <section className="pr-section glass-panel">
          <div className="pr-grid-three">
            {[0, 1, 2].map((idx) => {
              const slot = prSlots?.find((s) => s.slotIndex === idx);
              const exerciseName = slot?.exercise?.name || "Add Exercise";
              const prData = prWeights[slot?.exerciseId];
              const weight = prData?.weight || "--";
              const dateStr = prData?.date || "";

              return (
                <div
                  key={idx}
                  className="pr-slot pr-slot-interactive"
                  onClick={() => {
                    setActiveSlot(idx);
                    setIsModalOpen(true);
                  }}
                >
                  <span className="stat-label">{exerciseName}</span>
                  <div className="pr-display-small">
                    <span className="pr-value-small">
                      {weight}
                      <span className="pr-unit-kg">Kg</span>
                    </span>
                    <span className="pr-unit-small">PR</span>
                  </div>
                  {dateStr && <div className="pr-date-display">{dateStr}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Duration Graph */}
        <section className="duration-section glass-panel">
          <div className="duration-header">
            <div className="duration-info">
              <h3>Workout Duration</h3>
              <p className="avg-overlay">
                Avg session: <strong>{formatDuration(durationData.average)}</strong>
              </p>
            </div>
            <div className="duration-toggle">
              {[
                { label: "7D", value: 7 },
                { label: "30D", value: 30 },
                { label: "90D", value: 90 },
              ].map((d, index, array) => (
                <div key={d.value} className="toggle-item-wrapper">
                  <button
                    className={range === d.value ? "active" : ""}
                    onClick={() => setRange(d.value)}
                  >
                    {d.label}
                  </button>
                  {index < array.length - 1 && (
                    <span className="separator">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="duration-chart-wrapper">
            {isLoadingDuration ? (
              <div className="skeleton-chart-overlay">
                <div className="skeleton-graph-bars">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="skeleton skeleton-bar"
                      style={{ height: `${20 + Math.random() * 60}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="duration-y-axis">
                  {yLabels.map((label, idx) => (
                    <span key={idx}>{label}m</span>
                  ))}
                </div>

                <div className="duration-graph-container">
                  {durationData.series.map((day, i) => {

                    return (
                      <div key={i} className="bar-wrapper">
                        <div
                          className="dynamic-duration-bar"
                          style={{
                            height: `${(day.duration / 60 / maxDurationMins) * 100}%`,
                            opacity: day.duration > 0 ? 1 : 0.1,
                          }}
                        >
                          <div className="bar-tether-line" />
                          <span className="bar-hover-label">
                            {day.label}
                            <br />
                            <strong>{formatDuration(day.duration)}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <aside className="profile-right-panel glass-panel">
        <ProfileRightPanel />
      </aside>

      <ExerciseSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleExerciseSelect}
      />
    </div>
  );
}
