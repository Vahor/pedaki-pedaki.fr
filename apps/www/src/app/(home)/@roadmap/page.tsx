import { TooltipProvider } from '@pedaki/common/ui/tooltip';
import Footer from '~/app/(home)/@roadmap/footer';
import Header from '~/app/(home)/@roadmap/header';
import { getRoadmapIssues } from '~/services/github/roadmap';
import React from 'react';
import { GithubCard } from './card';

const Roadmap = async () => {
  const roadmap = await getRoadmapIssues();
  // split the roadmap in 3 columns
  const roadmapSize = roadmap.items.nodes.length;
  const roadmapSizePerColumn = Math.ceil(roadmapSize / 3);
  const roadmapColumns = [
    roadmap.items.nodes.slice(0, roadmapSizePerColumn),
    roadmap.items.nodes.slice(roadmapSizePerColumn, roadmapSizePerColumn * 2),
    roadmap.items.nodes.slice(roadmapSizePerColumn * 2, roadmapSize),
  ] as const;

  return (
    <section className="container py-16">
      <Header />
      <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-6">
        <TooltipProvider delayDuration={0}>
          <div className="col-span-6 flex flex-col gap-4 md:col-span-3 lg:col-span-2 lg:scale-95">
            {roadmapColumns[0].map(issue => (
              <GithubCard key={issue.content.number} issue={issue} />
            ))}
          </div>
          <div className="col-span-6 flex flex-col gap-4 md:col-span-3 lg:col-span-2">
            {roadmapColumns[1].map(issue => (
              <GithubCard key={issue.content.number} issue={issue} />
            ))}
          </div>
          {/* Hide this column on smaller screen (shown on lg)*/}
          <div className="col-span-6 hidden flex-col gap-4 md:col-span-3 lg:col-span-2 lg:flex lg:scale-95">
            {roadmapColumns[2].map(issue => (
              <GithubCard key={issue.content.number} issue={issue} />
            ))}
          </div>
        </TooltipProvider>
      </div>
      <Footer />
    </section>
  );
};

export default Roadmap;

export const revalidate = 3600; // 1 hour
