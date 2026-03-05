import { describe, expect, it } from "vitest";
import { stripHostPorts } from "./strip-host-ports.js";

describe("stripHostPorts", () => {
	it("strips host port from short syntax (host:container)", () => {
		const yaml = `
services:
  web:
    image: nginx
    ports:
      - "8080:80"
      - "443:443"
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain('"80"');
		expect(result).toContain('"443"');
		expect(result).not.toContain("8080");
	});

	it("strips host IP and port from extended short syntax", () => {
		const yaml = `
services:
  web:
    image: nginx
    ports:
      - "0.0.0.0:8080:80"
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain('"80"');
		expect(result).not.toContain("8080");
		expect(result).not.toContain("0.0.0.0");
	});

	it("preserves protocol suffix", () => {
		const yaml = `
services:
  web:
    image: nginx
    ports:
      - "8080:80/tcp"
      - "5353:53/udp"
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain("80/tcp");
		expect(result).toContain("53/udp");
		expect(result).not.toContain("8080");
		expect(result).not.toContain("5353");
	});

	it("keeps container-only ports unchanged", () => {
		const yaml = `
services:
  web:
    image: nginx
    ports:
      - "80"
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain('"80"');
	});

	it("handles multiple services", () => {
		const yaml = `
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  redis:
    image: redis
    ports:
      - "6379:6379"
  searxng:
    image: searxng/searxng
    ports:
      - "8888:8080"
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain('"80"');
		expect(result).toContain('"6379"');
		expect(result).toContain('"8080"');
		expect(result).not.toContain("8888");
	});

	it("returns original YAML if no services section", () => {
		const yaml = `version: "3"`;
		const result = stripHostPorts(yaml);
		expect(result).toBe(yaml);
	});

	it("handles services with no ports", () => {
		const yaml = `
services:
  web:
    image: nginx
`;
		const result = stripHostPorts(yaml);
		expect(result).toContain("nginx");
	});
});
