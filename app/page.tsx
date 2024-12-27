// app/page.tsx
import MarpEditor from './components/MarpEditor';

export default function Home() {
  return (
    <main>
      <h1>Marp Editor</h1>
      <MarpEditor /> {/* MarpEditorコンポーネントを使用 */}
    </main>
  );
}