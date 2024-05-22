import PanelTableButtons from '@/components/adminPageComponents/PanelTableButtons';
import Questions from '@/components/adminPageComponents/Questions';

export default function QuestionsPage() {
  return (
    <div className="flex items-start justify-center h-screen relative ">
      <PanelTableButtons />
      <Questions />
    </div>
  );
}
