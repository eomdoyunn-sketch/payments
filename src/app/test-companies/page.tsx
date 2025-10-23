"use client";

import { useEffect, useState } from "react";
import { getActiveCompanies } from "@/app/actions/companies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Company = {
  code: string;
  name: string;
  status: string;
};

export default function TestCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testCompanies() {
      try {
        console.log('Testing getActiveCompanies...');
        const result = await getActiveCompanies();
        console.log('Result:', result);
        setCompanies(result);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    testCompanies();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>계열사 목록 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <div className="text-red-500">
              <p>오류: {error}</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">총 {companies.length}개의 계열사가 있습니다.</p>
              {companies.length === 0 ? (
                <p className="text-yellow-600">⚠️ 계열사가 없습니다. 데이터베이스를 확인하세요.</p>
              ) : (
                <div className="space-y-2">
                  {companies.map((company) => (
                    <div key={company.code} className="p-2 border rounded">
                      <strong>{company.name}</strong> ({company.code}) - {company.status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">디버깅 정보:</h3>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>현재 시간: {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



