import { Hand } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import SignLanguageConverter from '@/components/SignLanguageConverter';

const VisualSchedulePage = () => {
  return (
    <MainLayout>
      <div className="p-8 max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Hand className="w-8 h-8" />
          Sign Language Converter
        </h1>
        <p className="text-muted-foreground mb-6">
          Convert text or speech to sign language animations. Use the controls below to interact with the 3D avatar.
        </p>
        <SignLanguageConverter />
      </div>
    </MainLayout>
  );
};

export default VisualSchedulePage;
