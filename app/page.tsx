import PortfolioClient from "@/components/portfolio-client";
import PortfolioEntrance from "@/components/portfolio-entrance";
import PortfolioSceneProvider from "@/components/portfolio-scene";
import PortfolioAudioProvider from "@/components/portfolio-audio";

export default function Home() {
  return (
    <PortfolioSceneProvider>
      <PortfolioAudioProvider>
        <PortfolioEntrance>
          <PortfolioClient cinematic />
        </PortfolioEntrance>
      </PortfolioAudioProvider>
    </PortfolioSceneProvider>
  );
}
