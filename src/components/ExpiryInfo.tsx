import React from "react";
import { formatExpiryDate } from "../utils/formatExpiryDate";

/**
 * 작은 Label + 크고 명확한 값.
 * 중요도는 색이 아니라 size · weight · spacing 으로만 만든다.
 */
export function ExpiryInfo({ expiresAt, now }: { expiresAt: string; now: number }) {
  return (
    <dl className="expiry">
      <dt className="expiry-label">QR 유효 시간</dt>
      <dd className="expiry-value">
        <time dateTime={expiresAt}>{formatExpiryDate(expiresAt, new Date(now))}</time>
      </dd>
    </dl>
  );
}
