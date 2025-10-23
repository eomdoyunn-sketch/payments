"use client"

import * as React from "react"
import { runAllScenarioTests, allScenarios } from "@/lib/test-scenarios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, PlayCircle } from "lucide-react"

export default function TestScenariosPage() {
  const [testResults, setTestResults] = React.useState<any[] | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)

  const runTests = () => {
    setIsRunning(true)
    setTimeout(() => {
      const results = runAllScenarioTests()
      setTestResults(results)
      setIsRunning(false)
    }, 100)
  }

  const passedCount = testResults?.filter(r => r.test.passed).length || 0
  const totalCount = allScenarios.length

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">시나리오 테스트</h1>
            <p className="text-muted-foreground mt-2">
              GYM29 결제 시스템 핵심 시나리오 8가지 자동 테스트
            </p>
          </div>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="lg"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            {isRunning ? "테스트 중..." : "테스트 실행"}
          </Button>
        </div>

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>테스트 결과</span>
                <Badge 
                  variant={passedCount === totalCount ? "default" : "destructive"}
                  className="text-lg px-4 py-1"
                >
                  {passedCount} / {totalCount} 통과
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map(({ scenario, test }, index) => (
                  <div
                    key={scenario.id}
                    className={`p-4 rounded-lg border ${
                      test.passed
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {test.passed ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold">
                            {scenario.id}
                          </span>
                          <span className="font-semibold">{scenario.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {test.passed ? "PASS" : "FAIL"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {scenario.description}
                        </p>
                        {!test.passed && (
                          <div className="bg-white p-3 rounded border mt-2 text-sm">
                            <div className="font-semibold text-red-700 mb-1">
                              실패 원인:
                            </div>
                            <div className="text-red-600 whitespace-pre-wrap">
                              {test.error}
                            </div>
                          </div>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2 rounded border">
                            <div className="font-semibold mb-1">예상 결과:</div>
                            <div className="font-mono">
                              canPass: {String(scenario.expectedResult.canPass)}
                            </div>
                            {scenario.expectedResult.reasonContains && (
                              <div className="font-mono text-muted-foreground">
                                reason: "{scenario.expectedResult.reasonContains}"
                              </div>
                            )}
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <div className="font-semibold mb-1">실제 결과:</div>
                            <div className="font-mono">
                              canPass: {String(test.result?.canPass)}
                            </div>
                            {test.result?.reason && (
                              <div className="font-mono text-muted-foreground">
                                reason: "{test.result.reason}"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!testResults && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>테스트를 실행하려면 위의 "테스트 실행" 버튼을 클릭하세요.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

