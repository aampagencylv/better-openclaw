import { getAllPresets, getAllServices, getAllSkillPacks } from "@better-openclaw/core";

/**
 * Generates shell completion scripts for bash, zsh, and fish.
 */

const COMMANDS = [
	"generate",
	"services",
	"presets",
	"validate",
	"init",
	"add",
	"remove",
	"status",
	"update",
	"backup",
	"deploy",
];

const _SUB_COMMANDS: Record<string, string[]> = {
	services: ["list"],
	presets: ["list", "info"],
	backup: ["create", "restore", "list"],
};

export function generateBashCompletion(): string {
	const serviceIds = getAllServices().map((s) => s.id);
	const presetIds = getAllPresets().map((p) => p.id);
	const skillIds = getAllSkillPacks().map((s) => s.id);

	return `# bash completion for create-better-openclaw
_create_better_openclaw() {
  local cur prev commands
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  commands="${COMMANDS.join(" ")}"

  case "\${prev}" in
    create-better-openclaw|better-openclaw)
      COMPREPLY=( $(compgen -W "\${commands}" -- "\${cur}") )
      return 0
      ;;
    services)
      COMPREPLY=( $(compgen -W "list" -- "\${cur}") )
      return 0
      ;;
    presets)
      COMPREPLY=( $(compgen -W "list info" -- "\${cur}") )
      return 0
      ;;
    info)
      COMPREPLY=( $(compgen -W "${presetIds.join(" ")}" -- "\${cur}") )
      return 0
      ;;
    add|remove)
      COMPREPLY=( $(compgen -W "${serviceIds.join(" ")}" -- "\${cur}") )
      return 0
      ;;
    --preset)
      COMPREPLY=( $(compgen -W "${presetIds.join(" ")}" -- "\${cur}") )
      return 0
      ;;
    --services)
      COMPREPLY=( $(compgen -W "${serviceIds.join(" ")}" -- "\${cur}") )
      return 0
      ;;
    --skills)
      COMPREPLY=( $(compgen -W "${skillIds.join(" ")}" -- "\${cur}") )
      return 0
      ;;
    --proxy)
      COMPREPLY=( $(compgen -W "none caddy traefik" -- "\${cur}") )
      return 0
      ;;
    --deployment)
      COMPREPLY=( $(compgen -W "local vps homelab clawexa" -- "\${cur}") )
      return 0
      ;;
    --deployment-type)
      COMPREPLY=( $(compgen -W "docker bare-metal" -- "\${cur}") )
      return 0
      ;;
    --output-format)
      COMPREPLY=( $(compgen -W "directory tar zip" -- "\${cur}") )
      return 0
      ;;
    --platform)
      COMPREPLY=( $(compgen -W "linux/amd64 linux/arm64 windows/amd64 macos/amd64 macos/arm64" -- "\${cur}") )
      return 0
      ;;
    --provider)
      COMPREPLY=( $(compgen -W "dokploy coolify" -- "\${cur}") )
      return 0
      ;;
    *)
      if [[ "\${cur}" == -* ]]; then
        COMPREPLY=( $(compgen -W "--yes --preset --services --skills --proxy --domain --monitoring --gpu --deployment --deployment-type --platform --output-format --force --dry-run --json --help --version" -- "\${cur}") )
      fi
      return 0
      ;;
  esac
}
complete -F _create_better_openclaw create-better-openclaw
complete -F _create_better_openclaw better-openclaw
`;
}

export function generateZshCompletion(): string {
	const serviceIds = getAllServices().map((s) => s.id);
	const presetIds = getAllPresets().map((p) => p.id);

	return `#compdef create-better-openclaw better-openclaw

_create_better_openclaw() {
  local -a commands
  commands=(
    'generate:Generate a new OpenClaw stack'
    'services:List available services'
    'presets:List preset configurations'
    'validate:Validate a stack configuration'
    'init:Initialize in current directory'
    'add:Add a service to existing stack'
    'remove:Remove a service from existing stack'
    'status:Show stack service status'
    'update:Pull latest images and restart'
    'backup:Manage stack backups'
    'deploy:Deploy stack to Dokploy or Coolify'
  )

  _arguments -C \\
    '--json[Output as JSON]' \\
    '--help[Show help]' \\
    '--version[Show version]' \\
    '1:command:->command' \\
    '*::arg:->args'

  case "$state" in
    command)
      _describe 'command' commands
      ;;
    args)
      case "$words[1]" in
        generate)
          _arguments \\
            '--yes[Skip wizard]' \\
            '--preset[Use preset]:preset:(${presetIds.join(" ")})' \\
            '--services[Service IDs]:services:' \\
            '--proxy[Proxy type]:proxy:(none caddy traefik)' \\
            '--domain[Domain]:domain:' \\
            '--gpu[Enable GPU]' \\
            '--monitoring[Enable monitoring]' \\
            '--dry-run[Preview only]' \\
            '--force[Overwrite existing]' \\
            '1:directory:_files -/'
          ;;
        add|remove)
          _arguments '1:service:(${serviceIds.join(" ")})'
          ;;
        presets)
          _arguments '1:subcommand:(list info)'
          ;;
        services)
          _arguments '1:subcommand:(list)'
          ;;
        backup)
          _arguments '1:subcommand:(create restore list)'
          ;;
        deploy)
          _arguments \\
            '--provider[PaaS provider]:provider:(dokploy coolify)' \\
            '--url[Instance URL]:url:' \\
            '--api-key[API key]:key:' \\
            '--dir[Project directory]:dir:_files -/'
          ;;
      esac
      ;;
  esac
}

_create_better_openclaw "$@"
`;
}

export function generateFishCompletion(): string {
	const serviceIds = getAllServices().map((s) => s.id);
	const presetIds = getAllPresets().map((p) => p.id);

	return `# fish completion for create-better-openclaw
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "generate" -d "Generate a new OpenClaw stack"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "services" -d "List available services"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "presets" -d "List preset configurations"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "validate" -d "Validate a stack"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "init" -d "Initialize in current directory"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "add" -d "Add a service"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "remove" -d "Remove a service"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "status" -d "Show stack status"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "update" -d "Update stack images"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "backup" -d "Manage backups"
complete -c create-better-openclaw -n "__fish_use_subcommand" -a "deploy" -d "Deploy to Dokploy or Coolify"

# generate flags
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l yes -s y -d "Skip wizard"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l preset -xa "${presetIds.join(" ")}" -d "Use preset"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l proxy -xa "none caddy traefik" -d "Proxy type"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l gpu -d "Enable GPU"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l monitoring -d "Enable monitoring"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from generate" -l dry-run -d "Preview only"

# add/remove service completions
${serviceIds.map((id) => `complete -c create-better-openclaw -n "__fish_seen_subcommand_from add remove" -a "${id}"`).join("\n")}

# presets subcommands
complete -c create-better-openclaw -n "__fish_seen_subcommand_from presets" -a "list info"
${presetIds.map((id) => `complete -c create-better-openclaw -n "__fish_seen_subcommand_from presets; and __fish_seen_subcommand_from info" -a "${id}"`).join("\n")}

# services subcommands
complete -c create-better-openclaw -n "__fish_seen_subcommand_from services" -a "list"

# backup subcommands
complete -c create-better-openclaw -n "__fish_seen_subcommand_from backup" -a "create restore list"

# deploy flags
complete -c create-better-openclaw -n "__fish_seen_subcommand_from deploy" -l provider -xa "dokploy coolify" -d "PaaS provider"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from deploy" -l url -d "Instance URL"
complete -c create-better-openclaw -n "__fish_seen_subcommand_from deploy" -l api-key -d "API key"
`;
}
