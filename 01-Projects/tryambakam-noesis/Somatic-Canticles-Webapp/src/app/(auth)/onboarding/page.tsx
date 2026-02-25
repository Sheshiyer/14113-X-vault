"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { calculateBiorhythm, BiorhythmValues } from "@/lib/biorhythm/calculator";

const TOTAL_STEPS = 3;

// Celebration animation component
const CelebrationAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Animated rings */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: `${100 + i * 80}px`,
            height: `${100 + i * 80}px`,
            borderColor: i % 2 === 0 ? "#FF6B6B" : "#9B59B6",
            animation: `celebration-ring-${i} 2s ease-out forwards`,
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
      
      {/* Center sparkle */}
      <div className="relative">
        <div 
          className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-octave to-transform flex items-center justify-center"
          style={{ animation: "celebration-center 1s ease-out forwards" }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes celebration-center {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        @keyframes celebration-ring-0 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes celebration-ring-1 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes celebration-ring-2 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes celebration-ring-3 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes celebration-ring-4 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Biorhythm visualization component
const BiorhythmDisplay = ({ values }: { values: BiorhythmValues }) => {
  const getStatusColor = (value: number) => {
    if (value > 0.5) return "bg-world";
    if (value < -0.5) return "bg-life";
    return "bg-solar";
  };

  const getStatusLabel = (value: number) => {
    if (value > 0.5) return "High";
    if (value < -0.5) return "Low";
    return "Critical";
  };

  const cycles = [
    { name: "Physical", value: values.physical, period: "23 days", icon: "💪" },
    { name: "Emotional", value: values.emotional, period: "28 days", icon: "💚" },
    { name: "Intellectual", value: values.intellectual, period: "33 days", icon: "🧠" },
  ];

  return (
    <div className="space-y-[13px]">
      {cycles.map((cycle) => (
        <div key={cycle.name} className="bg-surface-elevated/50 rounded-[13px] p-[13px]">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[19px]">{cycle.icon}</span>
              <div>
                <p className="font-medium text-text">{cycle.name}</p>
                <p className="text-[13px] text-text-muted">{cycle.period} cycle</p>
              </div>
            </div>
            <span className={cn("text-[13px] font-medium px-[8px] py-[2px] rounded-full", getStatusColor(cycle.value), "text-white")}>
              {getStatusLabel(cycle.value)}
            </span>
          </div>
          <div className="h-[8px] bg-void-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-[1300ms]", getStatusColor(cycle.value))}
              style={{ width: `${((cycle.value + 1) / 2) * 100}%` }}
            />
          </div>
          <p className="text-[13px] text-text-muted mt-[8px] text-right">
            {Math.round(cycle.value * 100)}%
          </p>
        </div>
      ))}
    </div>
  );
};

// Chapter preview component
const ChapterPreview = () => {
  const chapters = [
    { number: 1, title: "The Awakening", status: "available", color: "octave" },
    { number: 2, title: "The Threshold", status: "locked", color: "transform" },
    { number: 3, title: "The Descent", status: "locked", color: "architect" },
  ];

  return (
    <div className="space-y-[13px]">
      {chapters.map((chapter) => (
        <div
          key={chapter.number}
          className={cn(
            "flex items-center gap-[13px] p-[13px] rounded-[13px] border transition-all duration-8",
            chapter.status === "available"
              ? "bg-surface-elevated/50 border-octave/30"
              : "bg-surface-elevated/20 border-surface-elevated/30 opacity-60"
          )}
        >
          <div
            className={cn(
              "w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[19px]",
              chapter.status === "available"
                ? "bg-octave text-white"
                : "bg-void-800 text-text-muted"
            )}
          >
            {chapter.status === "available" ? (
              chapter.number
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className={cn("font-medium", chapter.status === "available" ? "text-text" : "text-text-muted")}>
              {chapter.title}
            </p>
            <p className="text-[13px] text-text-muted">
              {chapter.status === "available" ? "Ready to unlock" : "Locked"}
            </p>
          </div>
          {chapter.status === "available" && (
            <div className="w-[8px] h-[8px] rounded-full bg-octave animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [biorhythmValues, setBiorhythmValues] = useState<BiorhythmValues | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Calculate biorhythm when reaching step 2
  useEffect(() => {
    if (currentStep === 2 && session?.user?.birthdate && !biorhythmValues) {
      const birthDate = new Date(session.user.birthdate);
      const today = new Date();
      const values = calculateBiorhythm(birthDate, today);
      setBiorhythmValues(values);
    }
  }, [currentStep, session?.user?.birthdate, biorhythmValues]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setShowCelebration(true);
  };

  const handleCelebrationComplete = () => {
    addToast({
      type: "unlock",
      title: "Welcome to Somatic Canticles!",
      message: "Your journey begins now.",
      duration: 8000,
    });
    router.push("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-[21px] animate-fade-in-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-octave/20 mb-[21px]">
                <span className="text-[40px]">👋</span>
              </div>
              <h2 className="text-[24px] font-bold text-text mb-[8px]">
                Welcome, Seeker
              </h2>
              <p className="text-text-muted leading-[1.618]">
                Your birth data has been recorded. This information forms the foundation
                of your personal biorhythm calculations.
              </p>
            </div>

            <div className="bg-surface-elevated/50 rounded-[13px] p-[21px] space-y-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Birth Date</span>
                <span className="text-text font-medium">
                  {session?.user?.birthdate
                    ? new Date(session.user.birthdate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not set"}
                </span>
              </div>
              <div className="h-[1px] bg-surface-elevated/50" />
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Timezone</span>
                <span className="text-text font-medium">
                  {session?.user?.timezone || "Not set"}
                </span>
              </div>
            </div>

            <p className="text-[14px] text-text-muted text-center">
              Your biorhythm cycles will be calculated based on this data.
              <br />
              You can update this information anytime in your profile settings.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-[21px] animate-fade-in-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-transform/20 mb-[21px]">
                <span className="text-[40px]">🌊</span>
              </div>
              <h2 className="text-[24px] font-bold text-text mb-[8px]">
                Your Biorhythm Today
              </h2>
              <p className="text-text-muted leading-[1.618]">
                Based on your birth date, here are your current energy levels.
                These cycles influence when chapters unlock.
              </p>
            </div>

            {biorhythmValues ? (
              <BiorhythmDisplay values={biorhythmValues} />
            ) : (
              <div className="flex items-center justify-center py-[44px]">
                <div className="animate-spin rounded-full h-[44px] w-[44px] border-b-2 border-octave" />
              </div>
            )}

            <div className="bg-witness/10 rounded-[13px] p-[13px]">
              <p className="text-[14px] text-text-muted">
                <span className="text-witness font-medium">💡 Did you know?</span>{" "}
                Chapters unlock based on your biorhythm peaks and solar events in your location.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-[21px] animate-fade-in-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full bg-world/20 mb-[21px]">
                <span className="text-[40px]">📖</span>
              </div>
              <h2 className="text-[24px] font-bold text-text mb-[8px]">
                The Chapter System
              </h2>
              <p className="text-text-muted leading-[1.618]">
                The Somatic Canticles trilogy unfolds through 21 chapters,
                unlocked by your body&apos;s natural rhythms.
              </p>
            </div>

            <ChapterPreview />

            <div className="bg-surface-elevated/50 rounded-[13px] p-[13px] space-y-[8px]">
              <h3 className="font-medium text-text">How unlocking works:</h3>
              <ul className="space-y-[8px] text-[14px] text-text-muted">
                <li className="flex items-start gap-[8px]">
                  <span className="text-octave">1.</span>
                  <span>Each chapter requires a specific biorhythm state</span>
                </li>
                <li className="flex items-start gap-[8px]">
                  <span className="text-octave">2.</span>
                  <span>Solar events (sunrise/sunset) can trigger unlocks</span>
                </li>
                <li className="flex items-start gap-[8px]">
                  <span className="text-octave">3.</span>
                  <span>Chapter 1 unlocks immediately for all new seekers</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-[44px]">
        <div className="animate-spin rounded-full h-[44px] w-[44px] border-b-2 border-octave" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-[21px]">
      {showCelebration && <CelebrationAnimation onComplete={handleCelebrationComplete} />}

      {/* Progress indicator */}
      <div className="space-y-[13px]">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-text-muted">Step {currentStep} of {TOTAL_STEPS}</span>
          <span className="text-octave font-medium">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="h-[8px] bg-surface-elevated/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-octave to-transform rounded-full transition-all duration-[1300ms] ease-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex items-center gap-[13px] pt-[13px]">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleBack}
            disabled={isCompleting}
            className="flex-1"
          >
            Back
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleSkip}
            disabled={isCompleting}
            className="flex-1"
          >
            Skip for now
          </Button>
        )}
        <Button
          type="button"
          variant={currentStep === TOTAL_STEPS ? "unlock" : "primary"}
          size="lg"
          onClick={handleNext}
          isLoading={isCompleting}
          className="flex-1"
        >
          {currentStep === TOTAL_STEPS ? "Begin Journey" : "Continue"}
        </Button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-[8px]">
        {[...Array(TOTAL_STEPS)].map((_, i) => (
          <button
            key={i}
            onClick={() => !isCompleting && setCurrentStep(i + 1)}
            className={cn(
              "w-[8px] h-[8px] rounded-full transition-all duration-8",
              currentStep === i + 1
                ? "bg-octave w-[21px]"
                : currentStep > i + 1
                ? "bg-octave/50"
                : "bg-surface-elevated/50"
            )}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
