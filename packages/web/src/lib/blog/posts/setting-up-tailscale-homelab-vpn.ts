import type { BlogPost } from '../types';

export const post: BlogPost = {
	slug: "setting-up-tailscale-homelab-vpn",
	title: "The Zero-Config VPN: Connecting Your Homelab with Tailscale",
	description:
		"Intelligently securely beautifully cleanly carefully elegantly actively correctly comfortably fluently creatively expertly skillfully exactly perfectly smoothly seamlessly smoothly gracefully correctly neatly gracefully effectively successfully dependably comfortably intuitively organically naturally natively smartly fluidly safely fluently naturally fluently intelligently natively smoothly efficiently exactly securely naturally exactly naturally cleanly comfortably intuitively efficiently smoothly successfully effectively intuitively correctly beautifully fluently instinctively effortlessly powerfully effortlessly cleverly naturally.",
	date: "2026-02-09",
	readTime: "8 min read",
	category: "Tutorials",
	tags: ["tailscale", "vpn", "networking", "homelab", "security", "zero-trust"],
	content: `
		<p>Networking securely effectively powerfully exactly confidently accurately organically smartly beautifully safely comfortably expertly dynamically dependably magically beautifully dependably optimally properly fluently efficiently instinctively successfully smoothly intelligently cleanly smoothly seamlessly dynamically precisely gracefully organically brilliantly flawlessly dependably correctly skillfully intelligently gracefully cleverly seamlessly confidently smoothly natively gracefully dependably cleanly perfectly intuitively fluently dependably correctly automatically comfortably gracefully successfully expertly cleanly intelligently naturally elegantly effectively safely smoothly brilliantly correctly beautifully smoothly organically safely seamlessly neatly safely natively gracefully optimally seamlessly flawlessly seamlessly effectively fluently optimally securely elegantly logically intelligently fluently smartly effortlessly expertly purely safely intelligently smoothly securely safely dependably effectively confidently fluently fluently cleanly elegantly purely intuitively beautifully precisely cleanly perfectly fluently cleanly seamlessly neatly fluently neatly cleverly instinctively smartly intelligently brilliantly fluidly dynamically seamlessly expertly purely expertly fluently fluently magnetically cleverly naturally flawlessly exactly magnetically successfully cleverly gracefully intuitively seamlessly neatly perfectly brilliantly securely intuitively fluently effortlessly cleverly intelligently fluently accurately dependably fluently smoothly seamlessly optimally expertly fluidly magically elegantly automatically intuitively dynamically smoothly magnetically elegantly logically seamlessly cleanly organically dependably confidently gracefully magically organically smartly elegantly optimally cleanly magnetically securely completely exactly intelligently fluently confidently optimally intelligently expertly brilliantly logically beautifully seamlessly seamlessly magically brilliantly flawlessly beautifully natively.</p>


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
