import React, { useState, useEffect } from "react";

const WelcomeMessage = ({
  username = "Alex",
  avatarUrl = null,
  role = null,

  welcomeText = "Welcome back",
  statusText = "You're now signed in",
  showStatus = true,
  showTime = true,
  showGreeting = true,

  autoDismissMs = null, // ✅ added back
  position = "top-right",

  avatarBg = "bg-blue-50",
  avatarColor = "text-blue-500",
  statusDotColor = "bg-green-500",

  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Slide-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Auto dismiss
  useEffect(() => {
    if (!autoDismissMs) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs]);

  // ✅ Live time update (optional)
  useEffect(() => {
    if (!showTime) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [showTime]);

  const handleDismiss = () => {
    setVisible(false);

    // wait for animation before removing
    setTimeout(() => {
      setDismissed(true);
      if (onDismiss) onDismiss();
    }, 300); // match transition duration
  };

  const getInitials = (name) => {
  if (!name || typeof name !== "string") return "NA";

  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const positionClasses = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const slideClass = position.includes("top")
    ? visible ? "translate-y-0" : "-translate-y-3"
    : visible ? "translate-y-0" : "translate-y-3";

  if (dismissed) return null;

  return (
    <div
      className={`fixed z-50 w-full max-w-sm transition-all duration-300 ease-out
        ${positionClasses[position]}
        ${visible ? "opacity-100" : "opacity-0"} ${slideClass}`}
    >
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg flex flex-col gap-3">

        {/* Top Row */}
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className={`w-11 h-11 rounded-full flex items-center justify-center
                           font-medium text-sm shrink-0 overflow-hidden
                           ${avatarBg} ${avatarColor}`}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              getInitials(username)
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            {showGreeting && (
              <p className="text-xs text-gray-500 m-0">
                {getGreeting()}
              </p>
            )}
            <p className="text-base font-medium text-gray-900 mt-0.5 truncate m-0">
              {welcomeText}, {username}!
            </p>
            {role && (
              <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                {role}
              </span>
            )}
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-800 hover:bg-gray-100
                       p-1 rounded-md transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        {showStatus && <div className="h-px bg-gray-100" />}

        {/* Status */}
        {showStatus && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDotColor}`} />
            <span className="text-xs text-gray-500">{statusText}</span>

            {showTime && (
              <span className="ml-auto text-xs text-gray-400">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeMessage;