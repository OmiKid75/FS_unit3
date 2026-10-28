import { PLATFORM_LIMITS } from "./platformRules";

export const validatePlatformsClient = (content = "", platforms = []) => {
  const errors = [];
  const warnings = [];

  if (!platforms.length) {
    warnings.push("Select at least one platform before publishing");
  }

  platforms.forEach((platform) => {
    const rule = PLATFORM_LIMITS[platform];
    if (!rule) return;
    if (content.length > rule.maxChars) {
      errors.push(`${rule.label}: exceeds ${rule.maxChars} character limit`);
    } else if (content.length > rule.maxChars * 0.9) {
      warnings.push(`${rule.label}: nearing character limit`);
    }
  });

  return { valid: errors.length === 0, errors, warnings };
};
