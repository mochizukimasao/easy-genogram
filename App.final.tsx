import React from 'react'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">かんたんジェノグラム</h1>
      <p className="mt-4 text-gray-700">アプリケーションが正常に動作しています！</p>
      <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
        <p className="text-green-700">✅ React が正しく動作中</p>
        <p className="text-green-700">✅ Vite ビルドが成功</p>
        <p className="text-green-700">✅ Tailwind CSS が適用済み</p>
      </div>
    </div>
  )
}

export default App