export const PLATFORM_LIMITS = {
  facebook: { maxChars: 63206, label: "Facebook" },
  instagram: { maxChars: 2200, label: "Instagram" },
  whatsapp: { maxChars: 65536, label: "WhatsApp" },
};

export const validatePlatforms = (content = "", platforms = []) => {
  const errors = [];
  const warnings = [];

  if (!platforms.length) {
    errors.push("Select at least one platform");
  }

  platforms.forEach((platform) => {
    const rule = PLATFORM_LIMITS[platform];
    if (!rule) {
      errors.push(`Unknown platform: ${platform}`);
      return;
    }
    if (content.length > rule.maxChars) {
      errors.push(`${rule.label}: content exceeds ${rule.maxChars} characters by ${content.length - rule.maxChars}`);
    } else if (content.length > rule.maxChars * 0.9) {
      warnings.push(`${rule.label}: nearing character limit`);
    }
  });

  return { valid: errors.length === 0, errors, warnings };
};