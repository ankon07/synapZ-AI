import { useNavigate } from 'react-router-dom';
import { Mic, Gamepad2, Hand, Briefcase, Eye, Ear, Brain, Users } from 'lucide-react';

const ModuleSelector = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: 'Voice Based',
      subtitle: 'AI Tutor',
      icon: Mic,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500',
      path: '/voice-tutor',
    },
    {
      id: 2,
      title: 'Gamified',
      subtitle: 'learning',
      icon: Gamepad2,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500',
      path: '/adhd-learning',
    },
    {
      id: 3,
      title: 'AI Speech to',
      subtitle: 'Sign Language',
      icon: Hand,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500',
      path: '/bdsl-translator',
    },
    {
      id: 4,
      title: 'AI Career Skill',
      subtitle: 'Coach',
      icon: Briefcase,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500',
      path: '/jobs',
    },
  ];

  const leftIndicators = [
    { icon: Eye, label: 'Visually\nImpaired', color: 'text-purple-600' },
    { icon: Ear, label: 'Hearing\nImpaired', color: 'text-blue-600' },
  ];

  const rightIndicators = [
    { icon: Brain, label: 'Neurodiverse\nChildren', color: 'text-pink-600' },
    { icon: Users, label: 'PwDs Entering\nWorkforce', color: 'text-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-8 items-center">
          {/* Left Indicators */}
          <div className="hidden lg:flex flex-col gap-12 justify-center">
            {leftIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-2 ${indicator.color}`}>
                    <indicator.icon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {indicator.label}
                  </p>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
              </div>
            ))}
          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="text-center mb-4">
              <h1 className="text-6xl font-bold mb-2">
                <span className="text-cyan-500">SYNAPZ</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Not Disable, differently enabled
              </p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  className={`
                    relative overflow-hidden rounded-3xl p-8 
                    bg-gradient-to-br ${module.color}
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl
                    focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-500
                    group
                  `}
                >
                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col items-center text-center text-white">
                    {/* Icon Circle */}
                    <div className={`w-24 h-24 rounded-full ${module.bgColor} bg-opacity-80 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <module.icon className="w-12 h-12" />
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-1">
                      {module.title}
                    </h2>
                    <p className="text-xl font-semibold">
                      {module.subtitle}
                    </p>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              ))}
            </div>

            {/* SYNAPZ Badge */}
            <div className="mt-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full text-2xl font-bold shadow-lg">
                SYNAPZ
              </div>
            </div>
          </div>

          {/* Right Indicators */}
          <div className="hidden lg:flex flex-col gap-12 justify-center">
            {rightIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-300 to-transparent" />
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-2 ${indicator.color}`}>
                    <indicator.icon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {indicator.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Indicators */}
        <div className="lg:hidden mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...leftIndicators, ...rightIndicators].map((indicator, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-2 ${indicator.color}`}>
                <indicator.icon className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {indicator.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;
