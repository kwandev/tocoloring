import { HeroSection } from './hero-section';
import { ProcessSection } from './process-section';
import { ExamplesSection } from './examples-section';
import { PersonasSection } from './personas-section';

export function HomeScreen() {
  return (
    <div className="animate-in fade-in duration-300">
      <HeroSection />
      <ProcessSection />
      <ExamplesSection />
      <PersonasSection />
    </div>
  );
}
