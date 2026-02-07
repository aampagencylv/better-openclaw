
import { 
  Boxes, 
  Cpu, 
  Download, 
  Shield, 
  Zap,
  Bot, 
  Database,
  Workflow
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Database className="h-6 w-6 text-blue-400" />,
    title: "Battle-Tested Stack",
    description: "From n8n to Ollama, vector DBs to monitoring — every service is pre-configured for production.",
    className: "lg:col-span-2"
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    title: "Auto-Resolver",
    description: "Select services, we figure out dependencies. No more YAML hell.",
    className: "lg:col-span-1"
  },
  {
    icon: <Shield className="h-6 w-6 text-green-400" />,
    title: "Secure by Default",
    description: "Generated with secure secrets, non-root users, and proper network isolation.",
    className: "lg:col-span-1"
  },
  {
    icon: <Cpu className="h-6 w-6 text-purple-400" />,
    title: "Hardware Aware",
    description: "Intelligent GPU detection for AI workloads. Deploys optimized containers for your hardware.",
    className: "lg:col-span-2"
  },
  {
    icon: <Download className="h-6 w-6 text-primary" />,
    title: "One-Click Deploy",
    description: "Export a complete directory ready to run anywhere Docker lives.",
    className: "lg:col-span-3"
  }
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative">
       <div className="mx-auto max-w-7xl px-6 lg:px-8">
         <div className="mb-12 max-w-2xl">
           <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
             Everything you need to <br />
             <span className="text-primary">ship autonomous agents</span>
           </h2>
           <p className="text-muted-foreground text-lg">
             Stop wrestling with docker-compose files. Focus on building the brain, not the body.
           </p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {features.map((feature, i) => (
             <Card key={i} className={`bg-white/5 border-white/5 hover:border-primary/20 transition-colors ${feature.className}`}>
               <CardHeader>
                 <div className="mb-2 w-fit rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
                   {feature.icon}
                 </div>
                 <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground leading-relaxed">
                   {feature.description}
                 </p>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
    </section>
  );
}
