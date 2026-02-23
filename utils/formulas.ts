
/**
 * ENVIROSAGRO™ CLIENT-SIDE FORMULAS v1.0
 * ----------------------------------------
 * These formulas are for client-side simulation and UI display only.
 * The canonical, source-of-truth calculations are performed on the backend via cloud functions.
 */

/**
 * Calculates C(a)™ (Agro Code)
 * Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
 */
export const calculateAgroCode = (x: number, r: number, n: number): number => {
  if (r === 1) return x * n + 1;
  return x * ((Math.pow(r, n) - 1) / (r - 1)) + 1;
};

/**
 * Calculates m™ (Sustainable Time Constant)
 * Formula: m = sqrt((Dn * In * Ca) / S)
 */
export const calculateMConstant = (dn: number, in_val: number, ca: number, s: number): number => {
  const stress = Math.max(s, 0.001); // Prevent division by zero or negative stress
  return Math.sqrt((dn * in_val * ca) / stress);
};
