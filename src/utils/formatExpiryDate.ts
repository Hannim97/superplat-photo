const TZ = "Asia/Seoul";

function seoulParts(date: Date) {
  const out: Record<string, number> = {};
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", hourCycle: "h23",
  });
  for (const p of fmt.formatToParts(date)) if (p.type !== "literal") out[p.type] = Number(p.value);
  return out;
}

/**
 * 기획안 표기: "2026-09-24T15:00:00+09:00" → "9월 24일 15시까지"
 *  - 24시간제, 한국 시간 기준
 *  - 분이 있으면 "9월 24일 18시 30분까지"
 *  - 해가 바뀌면 "2027년 1월 2일 15시까지"
 * 남은 시간·카운트다운은 표시하지 않는다.
 */
export function formatExpiryDate(iso: string, now: Date = new Date()): string {
  const d = seoulParts(new Date(iso));
  const n = seoulParts(now);
  const year = d.year !== n.year ? `${d.year}년 ` : "";
  const minute = d.minute ? ` ${d.minute}분` : "";
  return `${year}${d.month}월 ${d.day}일 ${d.hour}시${minute}까지`;
}

export function isExpired(expiresAt: string, now: number): boolean {
  return Date.parse(expiresAt) <= now;
}
