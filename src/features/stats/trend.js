import { MONTHS } from "@/config/constants";
import { todayLocal } from "@/lib/format";

/** Mon–Fri hours for a weekly chart; days that haven't happened yet are gaps, not zeros. */
export const weekChartData = (week = []) => {
  const today = todayLocal();
  return week.map((d) => ({
    label: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
    value: d.date > today ? null : d.hours,
  }));
};

/** API trend rows → chart rows. `last` keeps only the most recent N months. */
export const trendData = (trend = [], last = 12) =>
  trend.slice(-last).map((t) => ({ label: MONTHS[t.month - 1].slice(0, 3), requested: t.requested, paid: t.paid }));

/** Latest month, the one before it, and the percentage change in what was paid (null when there's nothing to compare). */
export function trendChange(data) {
  const latest = data.at(-1);
  const previous = data.at(-2);
  const change = latest && previous?.paid ? ((latest.paid - previous.paid) / previous.paid) * 100 : null;
  return { latest, previous, change };
}
