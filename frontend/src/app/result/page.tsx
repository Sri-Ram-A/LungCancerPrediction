import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SparklesCore } from "@/components/ui/sparkles";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-amber-500/20"></div>
      
      {/* Sparkles background */}
      <div className="absolute inset-0">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={200}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 md:px-8 pb-8">
          {/* Hero Title */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-orange-100 to-amber-100 bg-clip-text text-transparent leading-tight">
              Anomaly detection in images using PatchCore
            </h1>
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span>Get In Touch</span>
                <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium hover:bg-white/20 transition-colors">
                <span>Careers</span>
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium hover:bg-white/20 transition-colors">
                <span>Our DNA</span>
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium hover:bg-white/20 transition-colors">
                <span>Blog</span>
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full font-medium hover:bg-white/20 transition-colors">
                <span>Podcast</span>
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            {/* Author */}
            <div className="text-center mb-8">
              <p className="text-orange-300 font-medium">By Toon Van Craenendonck</p>
            </div>
            
            {/* Article Text */}
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                Anomaly detection typically refers to the task of finding unusual or rare items that deviate significantly from what is considered to be the "normal" majority. In this blogpost, we look at image anomalies using <span className="text-white font-semibold">PatchCore</span>. Next to indicating which images are anomalous, PatchCore also identifies the most anomalous pixel regions within each image. One big advantage of PatchCore is that it only requires normal images for training, making it attractive for many use cases where abnormal images are rare or expensive to acquire. In some cases, we don't even know all the unusual patterns that we might encounter and training a supervised model is not an option. One example use case is the detection of defects in industrial manufacturing, where most defects are rare by definition as production lines are optimised to produce as few of them as possible. Recent approaches have made significant progress on anomaly detection in images, as demonstrated on the <span className="text-white font-semibold underline cursor-pointer">MVTec industrial benchmark dataset</span>. <span className="text-white font-semibold">PatchCore</span>, presented at CVPR 2022, is one of the frontrunners in this field.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
