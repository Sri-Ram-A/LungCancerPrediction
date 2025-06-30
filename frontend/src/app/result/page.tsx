"use client"

import React from "react"
import { Brain, BarChart3, TreePine, Target } from "lucide-react"
import { SparklesCore } from "@/components/ui/sparkles"
import handleSubmit from "@/api"
import { useHealthStore } from "@/store"
import Loader from "@/components/ui/3d-box-loader-animation"

interface ModelResult {
  prediction: string
  probability: number
  lime_image: string
}

interface BackendResponse {
  logistic: ModelResult
  gaussian: ModelResult
  decision_tree: ModelResult
  global_explainability: {
    shap_summary_image: string
    lime_summary_image: string
  }
}

const Index = () => {
  const { factors } = useHealthStore()
  const hasSubmitted = React.useRef(false)
  const [loading, setLoading] = React.useState(true)
  const [results, setResults] = React.useState<BackendResponse | null>(null)

  React.useEffect(() => {
    if (!hasSubmitted.current) {
      hasSubmitted.current = true
      const submitForm = async () => {
        try {
          console.log(factors)
          const data = await handleSubmit(factors)
          console.log("Response:", data)
          setResults(data)
        } catch (error) {
          console.error("Submit failed❌👎:", error)
        } finally {
          setLoading(false)
        }
      }
      submitForm()
    }
  }, [factors])

  // Show loader while waiting for response
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader />
      </div>
    )
  }

  const ModelCard = ({
    title,
    icon: Icon,
    result,
    color,
  }: {
    title: string
    icon: any
    result: ModelResult
    color: string
  }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Prediction:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              result.prediction === "1" ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
            }`}
          >
            {result.prediction === "1" ? "High Risk" : "Low Risk"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Probability:</span>
            <span className="text-white font-medium">{(result.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                result.probability > 0.5 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${result.probability * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-300 text-sm mb-2">LIME Explanation:</p>
          <img
            src={result.lime_image || "/placeholder.svg"}
            alt={`${title} LIME explanation`}
            className="w-full rounded-lg border border-white/20"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-orange-500/20"></div>

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
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-orange-100 to-amber-100 bg-clip-text text-transparent leading-tight">
              Understand Your Results using XAI
            </h1>
          </div>

          {results && (
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Model Results Section */}
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Model Predictions</h2>
                  <p className="text-gray-300">Results from different machine learning models</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ModelCard
                    title="Logistic Regression"
                    icon={BarChart3}
                    result={results.logistic}
                    color="bg-blue-500"
                  />
                  <ModelCard
                    title="Gaussian Naive Bayes"
                    icon={Brain}
                    result={results.gaussian}
                    color="bg-purple-500"
                  />
                  <ModelCard
                    title="Decision Tree"
                    icon={TreePine}
                    result={results.decision_tree}
                    color="bg-green-500"
                  />
                </div>
              </section>

              {/* Global Explainability Section */}
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Global Model Explainability</h2>
                  <p className="text-gray-300">Overall feature importance and model behavior analysis</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-orange-500">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">SHAP Summary</h3>
                    </div>
                    <img
                      src={results.global_explainability.shap_summary_image || "/placeholder.svg"}
                      alt="SHAP Global Explanation"
                      className="w-full rounded-lg border border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-pink-500">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">LIME Summary</h3>
                    </div>
                    <img
                      src={results.global_explainability.lime_summary_image || "/placeholder.svg"}
                      alt="LIME Global Explanation"
                      className="w-full rounded-lg border border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Summary Section */}
              <section className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">Analysis Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">
                        {results.logistic.prediction === "1" ? "High" : "Low"}
                      </div>
                      <div className="text-gray-300">Logistic Risk</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400">
                        {results.gaussian.prediction === "1" ? "High" : "Low"}
                      </div>
                      <div className="text-gray-300">Gaussian Risk</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        {results.decision_tree.prediction === "1" ? "High" : "Low"}
                      </div>
                      <div className="text-gray-300">Tree Risk</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Index
