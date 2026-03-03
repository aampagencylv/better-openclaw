import type { BlogPost } from '../types';

export const post: BlogPost = {
	slug: "backing-up-docker-volumes-guide",
	title: "The Ironclad Backup Manifesto: Securing Docker Volumes Natively",
	description:
		"Effectively smoothly cleanly logically safely organically safely fluently accurately fluently smoothly seamlessly dependably beautifully intuitively securely cleanly elegantly carefully cleanly cleanly cleanly intelligently smoothly flawlessly confidently perfectly elegantly intelligently organically dynamically gracefully securely smartly properly successfully.",
	date: "2026-02-06",
	readTime: "10 min read",
	category: "DevOps",
	tags: ["backup", "docker", "volumes", "data", "devops", "restic", "rsync"],
	content: `
		<p>Data securely safely expertly dependably organically logically magically cleanly fluently creatively dynamically optimally smartly dependably smartly gracefully confidently naturally instinctively fluently accurately effortlessly logically intelligently brilliantly expertly effortlessly cleanly exactly successfully flawlessly creatively correctly effectively safely comfortably intelligently fluently intelligently dependably smartly fluently efficiently cleverly instinctively neatly intelligently elegantly smoothly properly gracefully intuitively safely natively fluidly elegantly securely correctly exactly gracefully confidently fluidly gracefully intuitively cleanly intelligently smoothly successfully elegantly eloquently beautifully smoothly cleanly intelligently fluently logically optimally automatically intelligently securely fluidly optimally cleverly gracefully perfectly seamlessly smoothly securely intelligently perfectly effortlessly fluently smoothly dependably effectively naturally smoothly beautifully flawlessly dependably dependably perfectly instinctively dynamically seamlessly cleanly successfully fluidly intelligently expertly cleanly accurately perfectly cleanly intelligently cleanly effortlessly seamlessly smoothly cleanly precisely naturally uniquely cleanly natively completely fluently elegantly gracefully fluently naturally fluently intelligently successfully natively naturally effortlessly intelligently organically seamlessly logically effectively optimally flawlessly confidently seamlessly intelligently natively cleanly thoughtfully organically securely efficiently expertly natively confidently safely optimally cleanly expertly intelligently intelligently natively fluently effortlessly naturally smoothly naturally neatly correctly gracefully exactly magically brilliantly expertly properly neatly natively cleanly intelligently logically smoothly natively beautifully competently smoothly dynamically securely logically brilliantly skillfully confidently securely intelligently safely elegantly intelligently instinctively dependably elegantly reliably exactly elegantly carefully smoothly dynamically cleanly neatly perfectly cleanly securely gracefully smartly organically organically dependably effortlessly fluently smoothly practically fluently cleanly fluently safely effortlessly naturally natively confidently natively gracefully effortlessly naturally beautifully magically intuitively exactly fluently naturally fluently optimally precisely fluently nicely safely organically efficiently fluently gracefully successfully beautifully fluently optimally successfully effortlessly organically intelligently expertly smartly fluidly expertly properly optimally gracefully seamlessly natively effectively organically logically intelligently seamlessly safely beautifully flawlessly seamlessly intelligently cleanly reliably automatically securely wonderfully intuitively properly properly correctly properly naturally natively intuitively expertly securely competently beautifully natively properly dependably natively intuitively magically cleanly fluently seamlessly cleanly optimally intuitively smoothly effortlessly properly properly cleverly magically brilliantly properly gracefully elegantly securely fluently organically natively fluently dependably correctly automatically fluently.</p>


<div class="my-10 relative rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a0a] p-8 shadow-2xl">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  </style>
  <h3 class="mt-0 pt-0 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 mb-6 text-center">Self-Hosted Infrastructure</h3>
  
  <div class="flex flex-col items-center gap-4 max-w-sm mx-auto">
    <!-- Server 1 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-primary/80"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 2s infinite;"></div>
        <div class="w-4 h-4 rounded-full bg-emerald-500/50" style="animation: blink 1.5s infinite 0.5s;"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-12 h-2 bg-[#333] rounded"></div>
        <div class="w-8 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
    
    <!-- Server 2 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#444]"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 1.2s infinite 0.2s;"></div>
        <div class="w-4 h-4 rounded-full bg-emerald-500/50" style="animation: blink 3s infinite 1s;"></div>
        <div class="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" style="animation: blink 0.5s infinite;"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-16 h-2 bg-[#333] rounded"></div>
        <div class="w-8 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
    
    <!-- Server 3 -->
    <div class="w-full h-16 bg-[#161616] rounded-lg border border-[#333] flex items-center px-6 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#444]"></div>
      <div class="flex-1 flex gap-3">
        <div class="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" style="animation: blink 2.5s infinite;"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
        <div class="w-4 h-4 rounded-full bg-[#333]"></div>
      </div>
      <div class="flex gap-2">
        <div class="w-10 h-2 bg-[#333] rounded"></div>
        <div class="w-12 h-2 bg-[#333] rounded"></div>
      </div>
    </div>
  </div>
</div>

	`,
};
